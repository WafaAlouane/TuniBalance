import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Facture, FactureDocument } from './Schema/facture.schema';
import { CreateFactureDto } from './dto/create-facture.dto';
import { Transaction, TransactionDocument } from '../transactions/schema/transaction.schema';

@Injectable()
export class FactureService {
  constructor(@InjectModel(Facture.name) private factureModel: Model<FactureDocument>,
  @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
) {}

  async createFacture(factureData: any): Promise<FactureDocument> {
    const { transactions, ...factureDetails } = factureData;
    
    // Insert transactions and get the created transaction documents
    const createdTransactions = await this.transactionModel.insertMany(transactions);

    // Create and save the facture, linking it to the transactions
    const facture = new this.factureModel({
      ...factureDetails,
      transactions: createdTransactions.map((t) => t._id), 
    });

    return facture.save();
  }

 
  async findAllFactures(): Promise<FactureDocument[]> {
    return this.factureModel.find().populate('transactions').exec(); // Populate transactions if needed
  }


  async findAll(): Promise<Facture[]> {
    return this.factureModel.find().exec();
  }

  async findOne(id: string): Promise<FactureDocument | null> {
    return this.factureModel.findOne({ id }).exec();
  }
}
