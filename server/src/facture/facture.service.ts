import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Facture, FactureDocument } from './schema/facture.schema';
import { Transaction, TransactionDocument } from '../transactions/schema/transaction.schema';

@Injectable()
export class FactureService {
  constructor(
    @InjectModel(Facture.name) private factureModel: Model<FactureDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}

  async createFacture(factureData: any): Promise<FactureDocument> {
    const { transactions, type_facture, ...factureDetails } = factureData;

    console.log("Transactions reçues :", transactions);

    const createdTransactions = await this.transactionModel.insertMany(
      transactions.map((transaction: any) => ({
        ...transaction,
        compte: transaction.compte,  // Vérifier que 'compte' est bien transmis
        description: transaction.description,
      })),
    );

    console.log("Transactions créées :", createdTransactions);

    const facture = new this.factureModel({
      ...factureDetails,
      type_facture,
      transactions: createdTransactions,
    });

    return facture.save();
  }

  async findAllFactures(): Promise<FactureDocument[]> {
    return this.factureModel.find().populate('transactions').exec();
  }
}
