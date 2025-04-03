import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schema/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/UpdateTransactionDto';

@Injectable()
export class TransactionsService {
  constructor(@InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = new this.transactionModel(createTransactionDto);
    return transaction.save();
  }

  // Remove the populate and return just the raw transaction data
  async findAll(): Promise<Transaction[]> {
    return this.transactionModel.find().exec(); // No population
  }

  // Remove the populate here as well, just return the transaction object
  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionModel.findById(id).exec();
    if (!transaction) throw new NotFoundException('Transaction non trouvée');
    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const updatedTransaction = await this.transactionModel.findByIdAndUpdate(id, updateTransactionDto, { new: true });
    if (!updatedTransaction) throw new NotFoundException('Transaction non trouvée');
    return updatedTransaction;
  }

  async remove(id: string): Promise<void> {
    const deletedTransaction = await this.transactionModel.findByIdAndDelete(id);
    if (!deletedTransaction) throw new NotFoundException('Transaction non trouvée');
  }
  async getCompteResultat(): Promise<any> {
    const result = await this.transactionModel.aggregate([
        {
            $group: {
                _id: "$type_CResultat",
                total_debit: {
                    $sum: {
                        $cond: [{ $eq: ["$compte", "Débit"] }, "$montant", 0]
                    }
                },
                total_credit: {
                    $sum: {
                        $cond: [{ $eq: ["$compte", "Crédit"] }, "$montant", 0]
                    }
                },
                details: {
                    $push: {
                        description: "$description",
                        montant: "$montant",
                        compte: "$compte"
                    }
                }
            }
        },
        { $sort: { _id: 1 } }
    ]);
    return result;
}

}
