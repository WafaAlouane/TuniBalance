import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/UpdateTransactionDto';
import * as PDFDocument from 'pdfkit';
import {  Res } from '@nestjs/common';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('filter')
  async filterTransactions(
    @Query('type') type?: string,
    @Query('minAmount') minAmount?: number,
    @Query('maxAmount') maxAmount?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('statut') statut?: string,
    @Query('search') search?: string // Ajouter le paramètre de recherche
  ) {
    return this.transactionsService.filterTransactions({
      type,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      statut,
      search, // Passer le paramètre de recherche au service
    });
  }
  @Get('export/excel')
  async exportTransactionsToExcel(@Res() res: Response) {
    try {
    const transactions = await this.transactionsService.findAll(); // Tu récupères toutes les transactions
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');
  
    // En-têtes de colonnes
    worksheet.columns = [
      { header: 'ID', key: 'transaction_id', width: 36 },
      { header: 'Montant', key: 'montant', width: 15 },
      { header: 'Date', key: 'date_transaction', width: 20 },
      { header: 'Mode Paiement', key: 'mode_paiement', width: 20 },
      { header: 'Statut', key: 'statut', width: 15 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Catégorie', key: 'categorie', width: 15 },
      { header: 'Type Résultat', key: 'type_CResultat', width: 20 },
      { header: 'Sous-catégorie', key: 'sous_categorie', width: 30 },
      { header: 'Compte', key: 'compte', width: 10 },
    ];
  
    // Données
    transactions.forEach((tx) => {
      worksheet.addRow(tx);
    });
  
    // Headers HTTP pour le téléchargement
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.xlsx');
  
    // Générer le fichier Excel et le pipe dans la réponse
     return await workbook.xlsx.write(res).then(() => {
        res.status(200).end();
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l\'export' });
    }
  }

  
  @Get('compte-resultat/pdf')
  async getCompteResultatPDF(@Res() res: Response) {
    const data = await this.transactionsService.getCompteResultat();
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=compte-resultat.pdf');
    doc.pipe(res);

    doc.fontSize(18).text('Compte de Résultat', { align: 'center' }).moveDown();

    const renderSection = (title: string, charges: any[], produits: any[]) => {
      doc.fontSize(14).text(`Charges ${title}`, { underline: true });
      charges.forEach(line => {
        doc.text(`- ${line.sous_categorie}: ${line.montant} DT`);
      });

      doc.moveDown().fontSize(14).text(`Produits ${title}`, { underline: true });
      produits.forEach(line => {
        doc.text(`- ${line.sous_categorie}: ${line.montant} DT`);
      });
      doc.moveDown();
    };

    renderSection("d'exploitation", data.chargesExploitation, data.produitsExploitation);
    renderSection("financières", data.chargesFinancieres, data.produitsFinanciers);
    renderSection("exceptionnelles", data.chargesExceptionnelles, data.produitsExceptionnels);

    doc.fontSize(14).text(`Total Charges: ${data.totalCharges} DT`);
    doc.text(`Total Produits: ${data.totalProduits} DT`);
    doc.text(`Bénéfice: ${data.benefice} DT`);

    doc.end();
  }

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  // Endpoint to get all transactions
  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }
   /**
   * Endpoint pour récupérer les revenus d'une période donnée
   */
 @Get('revenus')
 async getRevenus(
   @Query('startDate') startDate: string,
   @Query('endDate') endDate: string
 ): Promise<{ totalRevenus: number, revenusParPeriode: any[] }> {
   return await this.transactionsService.getTotalRevenus(new Date(startDate), new Date(endDate));
 }
 
  @Get('compte-resultat')
  getCompteResultat() {
      return this.transactionsService.getCompteResultat();
  }
  @Get('cout-investissement')
  async getCoutInvestissement(@Query('annee') annee: number): Promise<{ coutInvestissement: number }> {
    const coutInvestissement = await this.transactionsService.getCoutInvestissement(annee);
    return { coutInvestissement };
  }

  

  // Endpoint to get a specific transaction by its ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  // Endpoint to update a transaction
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(id, updateTransactionDto);
  }
 
  // Endpoint to remove a transaction by its ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }
  
  

}
