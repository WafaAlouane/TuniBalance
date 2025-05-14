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
 
  // transactions.service.ts
  async filterTransactions(filters: {
    type?: string;
    minAmount?: number;
    maxAmount?: number;
    startDate?: string;
    endDate?: string;
    statut?: string;
    search?: string;
  }) {
    const query: any = {};

    // Filtres sur le type et statut
    if (filters.type) query.type_CResultat = filters.type;
    if (filters.statut) query.statut = filters.statut;

    // Filtres sur le montant
    if (filters.minAmount || filters.maxAmount) {
      query.montant = {};
      if (filters.minAmount) query.montant.$gte = filters.minAmount;
      if (filters.maxAmount) query.montant.$lte = filters.maxAmount;
    }

    // Filtres sur les dates
    if (filters.startDate || filters.endDate) {
      query.date_transaction = {};
      if (filters.startDate) query.date_transaction.$gte = new Date(filters.startDate);
      if (filters.endDate) query.date_transaction.$lte = new Date(filters.endDate);
    }

    // Recherche par description
    if (filters.search) {
      query.description = new RegExp(filters.search, 'i'); // Recherche insensible à la casse
    }

    return this.transactionModel.find(query).exec();
  }
  async getMonthlyStats() {
    const results = await this.transactionModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date_transaction" },
            month: { $month: "$date_transaction" }
          },
          charges: { 
            $sum: { 
              $cond: [{ $eq: ["$categorie", TypeTransaction.CHARGE] }, "$montant", 0] 
            } 
          },
          produits: { 
            $sum: { 
              $cond: [{ $eq: ["$categorie", TypeTransaction.PRODUIT] }, "$montant", 0] 
            } 
          }
        }
      },
      { 
        $sort: { "_id.year": 1, "_id.month": 1 } 
      }
    ]);
  
    return results.map(item => ({
      date: new Date(item._id.year, item._id.month - 1).toISOString(),
      charges: item.charges,
      produits: item.produits
    }));
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


  async findByYear(annee: number): Promise<TransactionDocument[]> {
    try {
      const debutAnnee = new Date(annee, 0, 1); // 1er janvier de l'année
      const finAnnee = new Date(annee, 11, 31, 23, 59, 59); // 31 décembre de l'année
  
      // Filtrer les transactions par date dans l'année spécifiée
      const transactions = await this.transactionModel.find({
        date_transaction: { $gte: debutAnnee, $lte: finAnnee }
      }).exec();
  
      return transactions;
    } catch (error) {
      console.error(`Erreur lors de la récupération des transactions pour l'année ${annee} :`, error.message);
      throw new Error(`Impossible de récupérer les transactions pour l'année ${annee}.`);
    }
  }
  async getCoutInvestissement(annee: number): Promise<number> {
    try {
      const debutAnnee = new Date(annee, 0, 1);
      const finAnnee = new Date(annee, 11, 31, 23, 59, 59);
  
      const transactionsInvestissement = await this.transactionModel.find({
        date_transaction: { $gte: debutAnnee, $lte: finAnnee },
        categorie: TypeTransaction.CHARGE,  
        sous_categorie: { $in: [
          SousCategorieCharge.REMPLACEMENT_MATERIEL, 
          SousCategorieCharge.INTERETS_EMPRUNTS, 
          SousCategorieCharge.ACHAT_MARCHANDISES 
        ]}
      }).exec();
  
      if (!transactionsInvestissement || transactionsInvestissement.length === 0) {
        throw new Error(`Aucun investissement trouvé pour l'année ${annee}.`);
      }
  
      const coutInvestissement = transactionsInvestissement.reduce((total, transaction) => total + transaction.montant, 0);
  
      return coutInvestissement;
    } catch (error) {
      console.error(`Erreur lors de la récupération du coût d’investissement pour l'année ${annee} :`, error.message);
      throw new Error(`Impossible de récupérer le coût d’investissement pour l'année ${annee}.`);
    }
  }

  async getCoutAchatsMarchandises(annee: number): Promise<number> {
    const debutAnnee = new Date(annee, 0, 1);
    const finAnnee = new Date(annee, 11, 31, 23, 59, 59);
  
    const achats = await this.transactionModel.find({
      date_transaction: { $gte: debutAnnee, $lte: finAnnee },
      categorie: TypeTransaction.CHARGE,
      sous_categorie: SousCategorieCharge.ACHAT_MARCHANDISES
    }).exec();
  
    return achats.reduce((total, transaction) => total + transaction.montant, 0);
  }
  
 /**
   * Récupérer les revenus sur une période donnée
   * @param startDate Date de début
   * @param endDate Date de fin
   */
 async getTotalRevenus(startDate: Date, endDate: Date): Promise<{ totalRevenus: number, revenusParPeriode: any[] }> {
  try {
    const transactions = await this.transactionModel.find({
      date_transaction: { $gte: startDate, $lte: endDate },
      categorie: 'Produit'
    }).lean().exec();

    if (!transactions || transactions.length === 0) {
      return { totalRevenus: 0, revenusParPeriode: [] };
    }

    const totalRevenus = transactions.reduce((total, transaction) => total + (transaction.montant || 0), 0);

    const revenusParPeriode = transactions.map(transaction => ({
      periode: transaction.date_transaction.toISOString().split('T')[0],  // Format YYYY-MM-DD
      revenus: transaction.montant
    }));

    return { totalRevenus, revenusParPeriode };
  } catch (error) {
    console.error("Erreur lors du calcul des revenus :", error.message);
    throw new Error("Impossible de récupérer les revenus.");
  }
}
  
  
}
  
  

  
