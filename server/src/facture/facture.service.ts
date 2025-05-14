import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Facture, FactureDocument } from './Schema/facture.schema';
import { Transaction, TransactionDocument } from '../transactions/schema/transaction.schema';

@Injectable()
export class FactureService {
  constructor(
    @InjectModel(Facture.name) private factureModel: Model<FactureDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}

  async createFacture(factureData: any): Promise<FactureDocument> {
    try {
      const { transactions, taux_tva, type_facture, ...factureDetails } = factureData;
  
      // Vérification de la présence des transactions
      if (!transactions || transactions.length === 0) {
        throw new BadRequestException('Une facture doit contenir au moins une transaction.');
      }

      // Vérification et conversion du montant total
      const montantTotal = parseFloat(factureDetails.montant_total.toString());
      if (isNaN(montantTotal) || montantTotal <= 0) {
        throw new BadRequestException('Le montant total est invalide.');
      }
  
      // Vérification de la TVA (assurez-vous qu'elle est un pourcentage valide)
      if (isNaN(taux_tva) || taux_tva < 0) {
        throw new BadRequestException('Le taux de TVA est invalide.');
      }
  
      // Calcul du montant TVA
      const montantTva = parseFloat((montantTotal * taux_tva).toFixed(2)); // Assurez-vous que la TVA est bien calculée
      if (isNaN(montantTva) || montantTva < 0) {
        throw new BadRequestException('Le montant de la TVA est invalide.');
      }
  
      // Calcul du montant TTC
      const montantTtc = parseFloat((montantTotal + montantTva).toFixed(2)); // Assurez-vous que la TVA est bien ajoutée au montant total
      if (isNaN(montantTtc) || montantTtc <= 0) {
        throw new BadRequestException('Le montant TTC est invalide.');
      }
  
      // Insertion des transactions
      const createdTransactions = await this.transactionModel.insertMany(
        transactions.map((transaction: any) => ({
          ...transaction,
          compte: transaction.compte,
          description: transaction.description,
        })),
      );
  
      // Création de la facture
      const facture = new this.factureModel({
        ...factureDetails,
        type_facture,
        transactions: createdTransactions,
        tva: montantTva,
        montant_ttc: montantTtc,
      });
  
      // Enregistrement de la facture
      return await facture.save();
    } catch (error) {
      console.error("Erreur lors de la création de la facture :", error.message);
      throw new InternalServerErrorException('Erreur lors de la création de la facture.');
    }
  }

  // Récupérer toutes les factures
  async findAllFactures(): Promise<FactureDocument[]> {
    try {
      return await this.factureModel.find().populate('transactions').exec();
    } catch (error) {
      console.error("Erreur lors de la récupération des factures :", error.message);
      throw new InternalServerErrorException('Erreur lors de la récupération des factures.');
    }
  }

  // Récupérer toutes les factures clients
  async findAllFacturesForClient(): Promise<FactureDocument[]> {
    try {
      return await this.factureModel
        .find({ type_facture: 'client' })
        .populate('transactions')
        .exec();
    } catch (error) {
      console.error("Erreur lors de la récupération des factures clients :", error.message);
      throw new InternalServerErrorException('Erreur lors de la récupération des factures clients.');
    }
  }

  // Récupérer toutes les factures fournisseurs
  async findAllFacturesForFournisseur(): Promise<FactureDocument[]> {
    try {
      return await this.factureModel
        .find({ type_facture: 'fournisseur' })
        .populate('transactions')
        .exec();
    } catch (error) {
      console.error("Erreur lors de la récupération des factures fournisseurs :", error.message);
      throw new InternalServerErrorException('Erreur lors de la récupération des factures fournisseurs.');
    }
  }

  async calculerChiffreAffaires(annee?: number): Promise<number> {
    try {
      const debutAnnee = annee ? new Date(annee, 0, 1) : null;
      const finAnnee = annee ? new Date(annee, 11, 31, 23, 59, 59) : null;
  
      // Récupérer toutes les factures clients, avec ou sans filtre par année
      const facturesClients = annee
        ? await this.factureModel.find({
            type_facture: 'client',
            date_emission: { $gte: debutAnnee, $lte: finAnnee }
          }).exec()
        : await this.findAllFacturesForClient(); 
  
      // Calculer le chiffre d'affaires total
      const chiffreAffaires = facturesClients.reduce((total, facture) => total + facture.montant_total, 0);
  
      return chiffreAffaires;
    } catch (error) {
      console.error("Erreur lors du calcul du chiffre d'affaires :", error.message);
      throw new InternalServerErrorException("Erreur lors du calcul du chiffre d'affaires.");
    }
  }

}