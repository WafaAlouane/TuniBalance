import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bilan, BilanDocument } from './schema/bilan.schema';
import { Transaction, TransactionDocument, SousCategorieCharge, SousCategorieProduit, TypeTransaction } from '../transactions/schema/transaction.schema';
import { Facture, FactureDocument } from '../facture/Schema/facture.schema';

@Injectable()
export class BilanService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(Bilan.name) private bilanModel: Model<BilanDocument>,
    @InjectModel(Facture.name) private factureModel: Model<FactureDocument>, 
  ) {}

  /**
   * Générer un bilan pour l'année courante.
   */
 /* async generateBilanForCurrentYear(): Promise<BilanDocument> {
    const currentDate = new Date(); 
    const currentYear = currentDate.getFullYear(); 

    const debutAnnee = new Date(currentYear, 0, 1); 
    const finAnnee = new Date(currentYear, 11, 31, 23, 59, 59); 

    try {
     
      const transactions = await this.transactionModel.find({
        date_transaction: { $gte: debutAnnee, $lte: finAnnee },
      }).exec();
// Factures clients non payées
const facturesClientsNonPayees = await this.factureModel.aggregate([
    {
      $match: {
        type_facture: 'client',
        date_emission: { $gte: debutAnnee, $lte: finAnnee },
        $expr: { $lt: ['$montant_paye', '$montant_total'] }
      }
    }
  ]);
  
  // Factures fournisseurs non payées
  const facturesFournisseursNonPayees = await this.factureModel.aggregate([
    {
      $match: {
        type_facture: 'fournisseur',
        date_emission: { $gte: debutAnnee, $lte: finAnnee },
        $expr: { $lt: ['$montant_paye', '$montant_total'] }
      }
    }
  ]);
  

      // Initialiser le bilan
      const bilan: Bilan = {
        annee: currentYear,
        actifsCirculants: [],
        actifsNonCirculants: [],
        passifsEmprunts: [],
        passifsDettes: [],
        capitauxPropresDetails: [],
        totalActifsCirculants: 0,
        totalActifsNonCirculants: 0,
        totalPassifsEmprunts: 0,
        totalPassifsDettes: 0,
        totalCapitauxPropres: 0,
      };

      
      transactions.forEach((transaction) => {
        const entry = { sous_categorie: transaction.sous_categorie, montant: transaction.montant };

        if (transaction.categorie === TypeTransaction.PRODUIT) {
          // Actifs
          switch (transaction.sous_categorie) {
            case SousCategorieProduit.VENTE_MARCHANDISES:
              bilan.actifsCirculants.push(entry);
              bilan.totalActifsCirculants += transaction.montant;
              break;

            default:
              bilan.actifsNonCirculants.push(entry);
              bilan.totalActifsNonCirculants += transaction.montant;
              break;
          }
        } else if (transaction.categorie === TypeTransaction.CHARGE) {
          // Passifs
          switch (transaction.sous_categorie) {
            case SousCategorieCharge.INTERETS_EMPRUNTS:
              bilan.passifsEmprunts.push(entry);
              bilan.totalPassifsEmprunts += transaction.montant;
              break;

            default:
              bilan.passifsDettes.push(entry);
              bilan.totalPassifsDettes += transaction.montant;
              break;
          }
        }
      });

      facturesClientsNonPayees.forEach((facture) => {
        const montantImpayé = facture.montant_total - facture.montant_paye;
        bilan.actifsCirculants.push({
          sous_categorie: `Facture Client Non Payée: ${facture.numero_facture}`,
          montant: montantImpayé,
        });
        bilan.totalActifsCirculants += montantImpayé;
      });

      // Ajouter les factures fournisseurs non payées aux passifs dettes
      facturesFournisseursNonPayees.forEach((facture) => {
        const montantImpayé = facture.montant_total - facture.montant_paye;
        bilan.passifsDettes.push({
          sous_categorie: `Facture Fournisseur Non Payée: ${facture.numero_facture}`,
          montant: montantImpayé,
        });
        bilan.totalPassifsDettes += montantImpayé;
      });

      const totalProduits = transactions
        .filter((t) => t.categorie === TypeTransaction.PRODUIT)
        .reduce((sum, t) => sum + t.montant, 0);

      const totalCharges = transactions
        .filter((t) => t.categorie === TypeTransaction.CHARGE)
        .reduce((sum, t) => sum + t.montant, 0);

      const resultatsNonDistribues = totalProduits - totalCharges;
      bilan.capitauxPropresDetails.push({ sous_categorie: 'Résultats Non Distribués', montant: resultatsNonDistribues });
      bilan.totalCapitauxPropres += resultatsNonDistribues;

      const capitalSocial = 200000; // Exemple statique
      bilan.capitauxPropresDetails.push({ sous_categorie: 'Capital Social', montant: capitalSocial });
      bilan.totalCapitauxPropres += capitalSocial;

      // Sauvegarde du bilan
      const newBilan = new this.bilanModel(bilan);
      return await newBilan.save();
    } catch (error) {
      console.error('Erreur lors de la génération du bilan :', error);
      throw new InternalServerErrorException('Erreur lors de la génération du bilan.');
    }
  }
*/
async generateBilanForYear(annee: number): Promise<BilanDocument> {
  try {
    const debutAnnee = new Date(annee, 0, 1);
    const finAnnee = new Date(annee, 11, 31, 23, 59, 59);

    // Vérifier si un bilan existe déjà pour cette année
    const existingBilan = await this.bilanModel.findOne({ annee });
    if (existingBilan) {
      return existingBilan; // Retourne le bilan existant sans le régénérer
    }

    // Récupérer transactions et factures pour l'année spécifiée
    const transactions = await this.transactionModel.find({
      date_transaction: { $gte: debutAnnee, $lte: finAnnee },
    }).exec();

    const facturesClientsNonPayees = await this.factureModel.aggregate([
      { $match: { type_facture: 'client', date_emission: { $gte: debutAnnee, $lte: finAnnee }, $expr: { $lt: ['$montant_paye', '$montant_total'] } } }
    ]);

    const facturesFournisseursNonPayees = await this.factureModel.aggregate([
      { $match: { type_facture: 'fournisseur', date_emission: { $gte: debutAnnee, $lte: finAnnee }, $expr: { $lt: ['$montant_paye', '$montant_total'] } } }
    ]);

    // Initialisation du bilan
    const bilan: Bilan = {
      annee,
      actifsCirculants: [],
      actifsNonCirculants: [],
      passifsEmprunts: [],
      passifsDettes: [],
      capitauxPropresDetails: [],
      totalActifsCirculants: 0,
      totalActifsNonCirculants: 0,
      totalPassifsEmprunts: 0,
      totalPassifsDettes: 0,
      totalCapitauxPropres: 0,
    };

    // Ajouter les transactions au bilan
    transactions.forEach((transaction) => {
      const entry = { sous_categorie: transaction.sous_categorie, montant: transaction.montant };

      if (transaction.categorie === TypeTransaction.PRODUIT) {
        bilan.actifsCirculants.push(entry);
        bilan.totalActifsCirculants += transaction.montant;
      } else if (transaction.categorie === TypeTransaction.CHARGE) {
        bilan.passifsDettes.push(entry);
        bilan.totalPassifsDettes += transaction.montant;
      }
    });

    // Ajouter les factures impayées
    facturesClientsNonPayees.forEach((facture) => {
      const montantImpayé = facture.montant_total - facture.montant_paye;
      bilan.actifsCirculants.push({ sous_categorie: `Facture Client Non Payée: ${facture.numero_facture}`, montant: montantImpayé });
      bilan.totalActifsCirculants += montantImpayé;
    });

    facturesFournisseursNonPayees.forEach((facture) => {
      const montantImpayé = facture.montant_total - facture.montant_paye;
      bilan.passifsDettes.push({ sous_categorie: `Facture Fournisseur Non Payée: ${facture.numero_facture}`, montant: montantImpayé });
      bilan.totalPassifsDettes += montantImpayé;
    });

    // Sauvegarde du bilan
    const newBilan = new this.bilanModel(bilan);
    return await newBilan.save();
  } catch (error) {
    console.error(`Erreur lors de la génération du bilan pour l'année ${annee} :`, error.message);
    throw new InternalServerErrorException(`Erreur lors de la génération du bilan pour l'année ${annee}.`);
  }
}
 
  async findBilanByYear(annee: number): Promise<BilanDocument[]> {
    return await this.bilanModel.find({ annee }).exec();
  }
}
