import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Facture, FactureDocument } from '../../facture/Schema/facture.schema';
import { Bilan, BilanDocument } from '../../bilan/schema/bilan.schema';
import { Transaction, TransactionDocument } from '../../transactions/schema/transaction.schema';
import * as PDFKit from 'pdfkit';
import * as ExcelJS from 'exceljs';
import { SousCategorieCharge } from '../../transactions/schema/transaction.schema';
import { FactureService } from 'src/facture/facture.service';

@Injectable()
export class ReportingFiscalService {
  constructor(
    @InjectModel(Bilan.name) private bilanModel: Model<BilanDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(Facture.name) private factureModel: Model<FactureDocument>,
    private readonly factureService: FactureService

  ) {}
  

  /**
   * Génère un rapport TVA trimestriel complet (PDF + Excel)
   */
  async genererRapportTVA(annee: number, trimestre: number): Promise<{ pdf: Buffer; excel: Buffer; details: any }> {
    const { dateDebut, dateFin } = this.getTrimestreDates(annee, trimestre);
    
    const factures = await this.factureModel.find({
      date_emission: { $gte: dateDebut, $lte: dateFin }
    }).exec();

    const { tvaCollectee, tvaDeductible, tvaAPayer, detailsFactures } = this.calculerTVA(factures);

    const pdfBuffer = await this.generateTVAPdf(annee, trimestre, tvaCollectee, tvaDeductible, tvaAPayer, detailsFactures);
    const excelBuffer = await this.generateTVAExcel(annee, trimestre, tvaCollectee, tvaDeductible, tvaAPayer, detailsFactures);

    return {
      pdf: pdfBuffer,
      excel: excelBuffer,
      details: {
        annee,
        trimestre,
        tvaCollectee,
        tvaDeductible,
        tvaAPayer,
        nombreFactures: factures.length
      }
    };
  }

  /**
   * Analyse des écarts entre impôt calculé et impôt payé
   */
  async analyserEcartsFiscaux(annee: number): Promise<{
    impotTheorique: number;
    impotPaye: number;
    ecart: number;
    analyse: string;
    details: any;
  }> {
    const [bilan, transactionsImpot] = await Promise.all([
      this.bilanModel.findOne({ annee }).exec(),
      this.transactionModel.find({
        sous_categorie: "IMPOT_BENEFICE",
        date_transaction: { 
            $gte: new Date(annee, 0, 1),  // Dynamisation de l'année
            $lte: new Date(annee, 11, 31, 23, 59, 59) // Fin de l'année dynamique
        }
    }).exec()
    ]);

    if (!bilan) {
      throw new Error(`Aucun bilan trouvé pour l'année ${annee}`);
    }

    const benefice = this.calculerBenefice(bilan);
    const impotTheorique = this.calculerImpotTheorique(benefice);
    const impotPaye = transactionsImpot.reduce((sum, t) => sum + t.montant, 0);
    const ecart = impotTheorique - impotPaye;
    console.log("Bénéfice :", benefice);
    console.log("Impôt Théorique :", impotTheorique);
    console.log("Impôt Payé :", impotPaye);
    console.log("Écart Fiscal :", ecart);
    return {
      impotTheorique,
      impotPaye,
      ecart,
      analyse: this.interpreterEcart(ecart),
      details: {
        annee,
        benefice,
        impotTheorique,
        impotPaye,
        ecart,
        transactionsImpot: transactionsImpot.map(t => ({
          date: t.date_transaction,
          montant: t.montant,
          description: t.description
        }))
      }
    };
  }

  /*********************
   * METHODES PRIVEES *
   ********************/

  private getTrimestreDates(annee: number, trimestre: number) {
    const dateDebut = new Date(annee, (trimestre - 1) * 3, 1);
    const dateFin = new Date(annee, trimestre * 3, 0, 23, 59, 59);
    return { dateDebut, dateFin };
  }

  private calculerTVA(factures: FactureDocument[]) {
    const detailsFactures = {
      clients: [] as any[],
      fournisseurs: [] as any[]
    };

    const tvaCollectee = factures
      .filter(f => f.type_facture === 'client')
      .reduce((sum, f) => {
        detailsFactures.clients.push({
          numero: f.numero_facture,
          date: f.date_emission,
          montantHT: f.montant_total,
          tva: f.tva
        });
        return sum + f.tva;
      }, 0);

    const tvaDeductible = factures
      .filter(f => f.type_facture === 'fournisseur')
      .reduce((sum, f) => {
        detailsFactures.fournisseurs.push({
          numero: f.numero_facture,
          date: f.date_emission,
          montantHT: f.montant_total,
          tva: f.tva
        });
        return sum + f.tva;
      }, 0);

    const tvaAPayer = tvaCollectee - tvaDeductible;

    return { tvaCollectee, tvaDeductible, tvaAPayer, detailsFactures };
  }

  private async generateTVAPdf(
    annee: number,
    trimestre: number,
    tvaCollectee: number,
    tvaDeductible: number,
    tvaAPayer: number,
    details: any
  ): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFKit({ margin: 50 });

      // En-tête
      doc.fontSize(20).text('Rapport TVA Trimestriel', { align: 'center' });
      doc.fontSize(16).text(`${annee} - Trimestre ${trimestre}`, { align: 'center' });
      doc.moveDown(2);

      // Résumé TVA
      doc.fontSize(14).text('Résumé TVA', { underline: true });
      doc.fontSize(12).text(`TVA Collectée: ${tvaCollectee.toFixed(2)} TND`);
      doc.text(`TVA Déductible: ${tvaDeductible.toFixed(2)} TND`);
      doc.text(`TVA Nette à Payer: ${tvaAPayer.toFixed(2)} TND`);
      doc.moveDown();

      // Détails factures clients
      doc.addPage();
      doc.fontSize(14).text('Factures Clients', { underline: true });
      this.generateFactureTable(doc, details.clients);

      // Détails factures fournisseurs
      doc.addPage();
      doc.fontSize(14).text('Factures Fournisseurs', { underline: true });
      this.generateFactureTable(doc, details.fournisseurs);

      // Pied de page
      doc.fontSize(10).text(`Généré le ${new Date().toLocaleDateString()}`, { align: 'right' });

      const buffers: Uint8Array[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.end();
    });
  }

  private generateFactureTable(doc: PDFKit.PDFDocument, factures: any[]) {
    const startY = doc.y;
    let y = startY;

    // En-têtes du tableau
    doc.font('Helvetica-Bold');
    doc.text('N° Facture', 50, y);
    doc.text('Date', 150, y);
    doc.text('Montant HT', 250, y);
    doc.text('TVA', 350, y);
    y += 20;

    // Contenu du tableau
    doc.font('Helvetica');
    factures.forEach(facture => {
      doc.text(facture.numero, 50, y);
      doc.text(facture.date.toLocaleDateString(), 150, y);
      doc.text(facture.montantHT.toFixed(2), 250, y);
      doc.text(facture.tva.toFixed(2), 350, y);
      y += 15;
    });

    // Ligne de séparation
    doc.moveTo(50, y).lineTo(400, y).stroke();
  }

  private async generateTVAExcel(
    annee: number,
    trimestre: number,
    tvaCollectee: number,
    tvaDeductible: number,
    tvaAPayer: number,
    details: any
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    
    // Feuille de résumé
    const summarySheet = workbook.addWorksheet('Résumé');
    summarySheet.addRow(['Rapport TVA Trimestriel', `${annee} - T${trimestre}`]);
    summarySheet.addRow(['TVA Collectée', tvaCollectee]);
    summarySheet.addRow(['TVA Déductible', tvaDeductible]);
    summarySheet.addRow(['TVA Nette à Payer', tvaAPayer]);

    // Feuille des factures clients
    const clientSheet = workbook.addWorksheet('Factures Clients');
    this.generateFactureExcelSheet(clientSheet, details.clients);

    // Feuille des factures fournisseurs
    const supplierSheet = workbook.addWorksheet('Factures Fournisseurs');
    this.generateFactureExcelSheet(supplierSheet, details.fournisseurs);

    const excelBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(excelBuffer as ArrayBuffer);
  }


  private generateFactureExcelSheet(sheet: ExcelJS.Worksheet, factures: any[]) {
    sheet.addRow(['N° Facture', 'Date', 'Montant HT', 'TVA']);
    
    factures.forEach(facture => {
      sheet.addRow([
        facture.numero,
        facture.date,
        facture.montantHT,
        facture.tva
      ]);
    });

    // Style du tableau
    sheet.getRow(1).font = { bold: true };
    sheet.columns = [
      { width: 20 },
      { width: 15 },
      { width: 15 },
      { width: 15 }
    ];
  }

  private calculerBenefice(bilan: BilanDocument): number {
    return (bilan.totalActifsCirculants + bilan.totalActifsNonCirculants) - 
           (bilan.totalPassifsEmprunts + bilan.totalPassifsDettes);
  }

  private calculerImpotTheorique(benefice: number): number {
    // Barème d'imposition tunisien (à adapter selon la réglementation en vigueur)
    if (benefice <= 0) return 0;
    if (benefice <= 100000) return benefice * 0.15;
    if (benefice <= 500000) return 15000 + (benefice - 100000) * 0.25;
    return 115000 + (benefice - 500000) * 0.35;
  }

  private interpreterEcart(ecart: number): string {
    const absEcart = Math.abs(ecart);
    if (absEcart < 100) return "Écart négligeable";
    if (ecart > 0) return `Écart significatif (${absEcart.toFixed(2)} TND) - Possible sous-déclaration`;
    return `Écart significatif (${absEcart.toFixed(2)} TND) - Possible surpaiement`;
  }


 
  private readonly tauxFiscalTunisie = {
    agriculture: 0.10,
    industrie: 0.20,
    commerce: 0.20,
    telecom: 0.35,
    societe_investissement: 0.35, 
    grandes_surfaces_franchises: 0.35,
    banques: 0.40
  };

  async verifierConformiteFiscaleAuto(annee: number, secteur: string) {
    try {
      const [transactionsImpot, chiffreAffaires] = await Promise.all([
        this.transactionModel.aggregate([
          { $match: { sous_categorie: "IMPOT_BENEFICE", date_transaction: { $gte: new Date(annee, 0, 1), $lte: new Date(annee, 11, 31, 23, 59, 59) } } },
          { $group: { _id: null, total: { $sum: "$montant" } } }
        ]).exec(),
  
        this.factureService.calculerChiffreAffaires(annee) // Appel à FactureService pour récupérer le chiffre d'affaires
      ]);
  
      const impotPaye = transactionsImpot.length ? transactionsImpot[0].total : 0;
  
      return this.analyserConformite({ chiffreAffaires, impotDeclare: impotPaye, secteur });
    } catch (error) {
      console.error(` Erreur vérification fiscale (${annee}, ${secteur}) :`, error.message);
      throw new InternalServerErrorException("Une erreur s'est produite lors de la vérification fiscale.");
    }
  }
  private analyserConformite(data: { chiffreAffaires: number; impotDeclare: number; secteur: string }) {
    // Vérifier si le secteur est valide
    const tauxApplicable = this.tauxFiscalTunisie[data.secteur] ?? null;
    if (!tauxApplicable) {
        return {
            statut: "erreur",
            message: "⚠️ Secteur inconnu - Impossible de vérifier la conformité.",
            couleur: "text-gray-500 bg-gray-900",
            details: data
        };
    }

    // Vérifier si les données sont disponibles
    if (data.impotDeclare === 0 && data.chiffreAffaires === 0) {
        return {
            statut: "aucune_donnee",
            message: "⚠️ Aucun impôt enregistré pour cette année.",
            couleur: "text-gray-500 bg-gray-900",
            details: data
        };
    }

    // Calcul de l'impôt attendu et de l'écart fiscal
    const impotAttenduCA = data.chiffreAffaires * tauxApplicable;
    const ecart = data.impotDeclare - impotAttenduCA;

    // Définition des messages et couleurs selon le statut fiscal
    let statut = "ok";
    let message = "✅ Conformité fiscale respectée.";
    let couleur = "text-green-500 bg-green-900";

    if (ecart > 0) {
        statut = "attention";
        message = `🔵 Surpaiement détecté ! Vous avez payé **${data.impotDeclare.toFixed(2)} TND**, alors que l'impôt attendu est **${impotAttenduCA.toFixed(2)} TND**.`;
        couleur = "text-blue-500 bg-blue-900";
    } else if (ecart < 0) {
        statut = "alerte";
        message = `🔴 Sous-déclaration possible ! Vous avez déclaré **${data.impotDeclare.toFixed(2)} TND**, alors que l'impôt attendu est **${impotAttenduCA.toFixed(2)} TND**.`;
        couleur = "text-red-500 bg-red-900";
    }

    return {
        statut,
        message,
        couleur,
        details: { ...data, tauxApplicable, impotAttenduCA, ecart }
    };
}

  
}