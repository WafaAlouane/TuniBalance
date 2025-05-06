import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from '../transactions/schema/transaction.schema';
import { SousCategorieCharge } from '../transactions/schema/transaction.schema';
import { Facture, FactureDocument } from 'src/facture/Schema/facture.schema';

interface ImpotEnRetard {
  type: SousCategorieCharge;
  description: string;
  dateLimite: Date;
  transactionsRetard?: any[];
  facturesImpayees?: any[];
}

@Injectable()
export class GestionImpotEtTaxesService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(Facture.name) private factureModel: Model<FactureDocument>,
  ) {}

  // 🔍 CALENDRIER FISCAL
  private calendrierFiscal = [
    { mois: 1, jour: 15, type: SousCategorieCharge.IMPOTS_TAXES, description: "Déclaration mensuelle d'impôt (Personnes physiques régime réel)" },
    { mois: 1, jour: 28, type: SousCategorieCharge.IMPOTS_TAXES, description: "Déclaration mensuelle d'impôt (Personnes morales)" },
    { mois: 4, jour: 15, type: SousCategorieCharge.SALAIRES, description: "Déclaration CNSS premier trimestre" },
    { mois: 6, jour: 25, type: SousCategorieCharge.IMPOT_BENEFICE, description: "Déclaration définitive de l'impôt sur les sociétés" },
    { mois: 12, jour: 5, type: SousCategorieCharge.IMPOT_BENEFICE, description: "Déclaration annuelle de l'impôt sur le revenu" }
  ];

  /**
   * ✅ Vérifie si un impôt est payé avant sa date limite
   */
  async verifierPaiementImpot(typeImpot: SousCategorieCharge, dateLimite: Date): Promise<boolean> {
    const paiement = await this.transactionModel.findOne({
      sous_categorie: typeImpot,
      statut: "Validée",
      montant: { $gt: 0 },
      date_transaction: { $lte: dateLimite }
    }).exec();

    return !!paiement;
  }

  /**
   * ⚠️ Détecte les impôts non payés ou en retard (transactions ET factures)
   */
  async verifierTransactionsEnRetard(typeImpot: SousCategorieCharge, dateLimite: Date): Promise<any[]> {
    const transactionsAssociees = await this.transactionModel.find({ sous_categorie: typeImpot }).exec();
    
    const transactionsEnRetard = transactionsAssociees
      .filter(t => new Date(t.date_transaction) > dateLimite)
      .map(t => ({
        ...t.toObject(),
        joursRetard: this.calculerJoursRetard(new Date(t.date_transaction))
      }));
  
    return transactionsEnRetard;
  }
  async verifierFacturesImpayees(typeImpot: SousCategorieCharge): Promise<any[]> {
    const facturesImpayees = await this.factureModel.find({
      'transactions.sous_categorie': typeImpot,
      date_echeance: { $lt: new Date() },
      statut: 'Non payé'
    }).exec();
  
    return facturesImpayees.map(f => ({
      ...f.toObject(),
      joursRetard: this.calculerJoursRetard(new Date(f.date_echeance))
    }));
  }

  async verifierImpotsNonRegles(): Promise<{ impotsEnRetard: ImpotEnRetard[] }> {
    const dateActuelle = new Date();
    const impotsEnRetard: ImpotEnRetard[] = [];
  
    for (const event of this.calendrierFiscal) {
      const dateLimite = new Date(dateActuelle.getFullYear(), event.mois - 1, event.jour);
  
      // 🔎 Récupérer transactions et factures
      const transactionsEnRetard = await this.verifierTransactionsEnRetard(event.type, dateLimite);
      const facturesImpayees = await this.verifierFacturesImpayees(event.type);
  
      // Ajout seulement si des retards sont détectés
      if (transactionsEnRetard.length > 0 || facturesImpayees.length > 0) {
        impotsEnRetard.push({
          type: event.type,
          description: event.description,
          dateLimite,
          ...(transactionsEnRetard.length > 0 && { transactionsRetard: transactionsEnRetard }),
          ...(facturesImpayees.length > 0 && { facturesImpayees })
        });
      }
    }
  
    return { impotsEnRetard };
  }
  
  
  /**
   * 🔔 Envoi d'une notification avant l'échéance fiscale
   */
  async notifierAvantEcheance(joursAvant: number): Promise<{ alertes: any[] }> {
    const dateActuelle = new Date();
    const alertes: Array<{ type: SousCategorieCharge; description: string; dateLimite: Date }> = [];

    for (const event of this.calendrierFiscal) {
      const dateLimite = new Date(dateActuelle.getFullYear(), event.mois - 1, event.jour);
      const dateNotif = new Date(dateLimite);
      dateNotif.setDate(dateNotif.getDate() - joursAvant);

      if (dateActuelle >= dateNotif && dateActuelle < dateLimite) {
        alertes.push({
          type: event.type,
          description: event.description,
          dateLimite
        });
      }
    }

    return { alertes };
  }

  /**
   * 🆕 Nouvelle méthode pour calculer les jours de retard
   */
  private calculerJoursRetard(dateEcheance: Date): number {
    const diffMs = new Date().getTime() - new Date(dateEcheance).getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }
}