import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/UpdateTransactionDto';
import { 
  Transaction, 
  TransactionDocument,
  TypeTransaction,
  TypeCompteResultat,
  SousCategorieCharge,
  SousCategorieProduit
} from './schema/transaction.schema';
export interface TransactionLine {
  sous_categorie: string;
  montant: number;
}
export interface CompteResultat {
  chargesExploitation: TransactionLine[];
  produitsExploitation: TransactionLine[];
  chargesFinancieres: TransactionLine[];
  produitsFinanciers: TransactionLine[];
  chargesExceptionnelles: TransactionLine[];
  produitsExceptionnels: TransactionLine[];
  totalChargesExploitation: number;
  totalProduitsExploitation: number;
  totalChargesFinancieres: number;
  totalProduitsFinanciers: number;
  totalChargesExceptionnelles: number;
  totalProduitsExceptionnels: number;
  totalCharges: number;
  totalProduits: number;
  benefice: number;
}
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
 
  
  async getCompteResultat(): Promise<CompteResultat> {
    const transactions = await this.transactionModel.find().exec();

    const compteResultat: CompteResultat = {
      chargesExploitation: [],
      produitsExploitation: [],
      chargesFinancieres: [],
      produitsFinanciers: [],
      chargesExceptionnelles: [],
      produitsExceptionnels: [],
      totalChargesExploitation: 0,
      totalProduitsExploitation: 0,
      totalChargesFinancieres: 0,
      totalProduitsFinanciers: 0,
      totalChargesExceptionnelles: 0,
      totalProduitsExceptionnels: 0,
      totalCharges: 0,
      totalProduits: 0,
      benefice: 0,
    };

    transactions.forEach((t) => {
      const entry: TransactionLine = {
        sous_categorie: t.sous_categorie,
        montant: t.montant
      };

      switch (t.type_CResultat) {
        case TypeCompteResultat.EXPLOITATION:
          if (t.categorie === TypeTransaction.CHARGE) {
            compteResultat.chargesExploitation.push(entry);
            compteResultat.totalChargesExploitation += t.montant;
          } else {
            compteResultat.produitsExploitation.push(entry);
            compteResultat.totalProduitsExploitation += t.montant;
          }
          break;

        case TypeCompteResultat.FINANCIERE:
          if (t.categorie === TypeTransaction.CHARGE) {
            compteResultat.chargesFinancieres.push(entry);
            compteResultat.totalChargesFinancieres += t.montant;
          } else {
            compteResultat.produitsFinanciers.push(entry);
            compteResultat.totalProduitsFinanciers += t.montant;
          }
          break;

        case TypeCompteResultat.EXCEPTIONNELLE:
          if (t.categorie === TypeTransaction.CHARGE) {
            compteResultat.chargesExceptionnelles.push(entry);
            compteResultat.totalChargesExceptionnelles += t.montant;
          } else {
            compteResultat.produitsExceptionnels.push(entry);
            compteResultat.totalProduitsExceptionnels += t.montant;
          }
          break;
      }
    });

    // Calcul des totaux
    compteResultat.totalCharges = [
      compteResultat.totalChargesExploitation,
      compteResultat.totalChargesFinancieres,
      compteResultat.totalChargesExceptionnelles
    ].reduce((a, b) => a + b, 0);

    compteResultat.totalProduits = [
      compteResultat.totalProduitsExploitation,
      compteResultat.totalProduitsFinanciers,
      compteResultat.totalProduitsExceptionnels
    ].reduce((a, b) => a + b, 0);

    compteResultat.benefice = compteResultat.totalProduits - compteResultat.totalCharges;

    return compteResultat;
  }
}
  
  
