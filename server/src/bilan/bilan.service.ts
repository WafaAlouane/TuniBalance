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
    const date_bilan = new Date(); // Date actuelle du bilan
    const anneeCalcul = date_bilan.getFullYear(); // Extraction de l'année automatiquement

    const dateDebut = new Date(`${anneeCalcul}-01-01`);
    const dateFin = new Date(`${anneeCalcul}-12-31`);

    console.log(`Calcul du bilan pour l'année : ${anneeCalcul}`);

    // Actif Immobilisé
    const actif_immobilise = await this.transactionModel.aggregate([
      { $match: { type_CResultat: { $in: ['Financière', 'Exceptionnelle'] }, compte: 'Débit', date: { $gte: dateDebut, $lte: dateFin } } },
      { $group: { _id: null, total: { $sum: "$montant" }, descriptions: { $push: "$description" } } }
    ]);

    // Actif Circulant (Stocks, Créances Clients)
    const creances_clients = await this.factureModel.aggregate([
      { $match: { statut: "non payée", date_emission: { $gte: dateDebut, $lte: dateFin } } },
      { $group: { _id: null, total: { $sum: "$montant_total" }, descriptions: { $push: "$description" } } }
    ]);

    const stocks = await this.transactionModel.aggregate([
      { $match: { description: { $in: ["Marchandise", "Stock"] }, date: { $gte: dateDebut, $lte: dateFin } } },
      { $group: { _id: null, total: { $sum: "$montant" }, descriptions: { $push: "$description" } } }
    ]);

    const actif_circulant = (creances_clients[0]?.total || 0) + (stocks[0]?.total || 0);

    // Capitaux Propres
    const capitaux_propres = await this.transactionModel.aggregate([
      { $match: { type_CResultat: "Exploitation", date: { $gte: dateDebut, $lte: dateFin } } },
      { $group: { _id: null, total: { $sum: { $cond: { if: { $eq: ["$compte", "Crédit"] }, then: "$montant", else: { $multiply: ["$montant", -1] } } } } } }
    ]);

    // Dettes (Factures Fournisseurs et Emprunts)
    const dettes_fournisseurs = await this.factureModel.aggregate([
      { $match: { type_facture: "fournisseur", statut: "non payée", date_emission: { $gte: dateDebut, $lte: dateFin } } },
      { $group: { _id: null, total: { $sum: "$montant_total" }, descriptions: { $push: "$description" } } }
    ]);

    const dettes_financieres = await this.transactionModel.aggregate([
      { $match: { type_CResultat: "Financière", compte: "Crédit", date: { $gte: dateDebut, $lte: dateFin } } },
      { $group: { _id: null, total: { $sum: "$montant" }, descriptions: { $push: "$description" } } }
    ]);

    const dettes = (dettes_fournisseurs[0]?.total || 0) + (dettes_financieres[0]?.total || 0);

    // Totaux
    const total_actif = (actif_immobilise[0]?.total || 0) + actif_circulant;
    const total_passif = (capitaux_propres[0]?.total || 0) + dettes;

    // Enregistrement du bilan
    const bilan = new this.bilanModel({
      date_bilan,
      annee: anneeCalcul, // Ajout de l'année calculée
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
