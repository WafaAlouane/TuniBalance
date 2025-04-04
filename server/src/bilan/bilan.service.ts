import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bilan, BilanDocument } from './schema/bilan.schema';
import { Transaction, TransactionDocument } from '../transactions/schema/transaction.schema';
import { Facture, FactureDocument } from '../factures/schema/facture.schema';

@Injectable()
export class BilanService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(Facture.name) private factureModel: Model<FactureDocument>,
    @InjectModel(Bilan.name) private bilanModel: Model<BilanDocument>,
  ) {}

  async calculerBilan(): Promise<BilanDocument> {
    const date_bilan = new Date();

    // Actif Immobilisé (Immobilisations)
    // Investissements à long terme
    const actif_immobilise = await this.transactionModel.aggregate([
      { $match: { type_CResultat: { $in: ['Financière', 'Exceptionnelle'] }, compte: 'Débit' } },
      { $group: { 
        _id: null, 
        total: { $sum: "$montant" }, 
        descriptions: { $push: "$description" } 
      } }
    ]);

    // Actif Circulant (Stocks, Créances Clients)
    // Factures non encore payées par les clients
    const creances_clients = await this.factureModel.aggregate([
      { $match: { statut: { $eq: "non payée" } } },
      { $group: { 
        _id: null, 
        total: { $sum: "$montant_total" }, 
        descriptions: { $push: "$description" } 
      } }
    ]);

    // Transactions avec description « Marchandise » ou « Stock »
    const stocks = await this.transactionModel.aggregate([
      { $match: { description: { $in: ["Marchandise", "Stock"] } } },
      { $group: { 
        _id: null, 
        total: { $sum: "$montant" }, 
        descriptions: { $push: "$description" } 
      } }
    ]);

    const actif_circulant = (creances_clients[0]?.total || 0) + (stocks[0]?.total || 0);

    // Capitaux Propres (Résultat Net)
    const capitaux_propres = await this.transactionModel.aggregate([
      { $match: { type_CResultat: "Exploitation" } },
      { $group: { 
        _id: null, 
        total: { 
          $sum: { 
            $cond: { 
              if: { $eq: ["$compte", "Crédit"] }, 
              then: "$montant", 
              else: { $multiply: ["$montant", -1] } 
            }
          } 
        }
      }}
    ]);

    // Dettes (Factures Fournisseurs et Emprunts)
    // Dettes fournisseurs
    const dettes_fournisseurs = await this.factureModel.aggregate([
      { $match: { type_facture: "fournisseur", statut: { $eq: "non payée" } } },
      { $group: { 
        _id: null, 
        total: { $sum: "$montant_total" }, 
        descriptions: { $push: "$description" } 
      } }
    ]);

    // Emprunts
    const dettes_financieres = await this.transactionModel.aggregate([
      { $match: { type_CResultat: "Financière", compte: "Crédit" } },
      { $group: { 
        _id: null, 
        total: { $sum: "$montant" }, 
        descriptions: { $push: "$description" } 
      } }
    ]);

    const dettes = (dettes_fournisseurs[0]?.total || 0) + (dettes_financieres[0]?.total || 0);

    // Totaux
    const total_actif = (actif_immobilise[0]?.total || 0) + actif_circulant;
    const total_passif = (capitaux_propres[0]?.total || 0) + dettes;

    // Enregistrement du bilan
    const bilan = new this.bilanModel({
      date_bilan,
      actif_immobilise: actif_immobilise[0]?.total || 0,
      actif_immobilise_descriptions: actif_immobilise[0]?.descriptions || [],
      actif_circulant,
      actif_circulant_descriptions: [
        ...(creances_clients[0]?.descriptions || []),
        ...(stocks[0]?.descriptions || [])
      ],
      total_actif,
      capitaux_propres: capitaux_propres[0]?.total || 0,
      dettes,
      dettes_descriptions: [
        ...(dettes_fournisseurs[0]?.descriptions || []),
        ...(dettes_financieres[0]?.descriptions || [])
      ],
      total_passif
    });

    return bilan.save();
  }

  async findAllBilans(): Promise<BilanDocument[]> {
    return this.bilanModel.find().sort({ date_bilan: -1 }).exec(); 
  }
}
