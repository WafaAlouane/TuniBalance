import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { GestionImpotEtTaxesService } from './gestion-impot-et-taxes.service';
import { Response } from 'express';
import { SousCategorieCharge } from 'src/transactions/schema/transaction.schema';

@Controller('gestion-impot-et-taxes')
export class GestionImpotEtTaxesController {
  constructor(private readonly gestionImpotEtTaxesService: GestionImpotEtTaxesService) {}

  /**
   * 🚨 Endpoint pour récupérer la liste des impôts en retard
   */
  @Get('impots-non-payes')
  async rapportImpotsNonPayes(@Res() res: Response) {
    try {
      const impotsEnRetard = await this.gestionImpotEtTaxesService.verifierImpotsNonRegles();
      res.status(HttpStatus.OK).json(impotsEnRetard);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des impôts en retard:', error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
  @Get('transactions/:typeImpot')
  async getTransactions(
    @Param('typeImpot') typeImpot: string,
    @Res() res: Response
  ) {
    try {
        const typeImpotEnum = SousCategorieCharge[typeImpot as keyof typeof SousCategorieCharge];

      const transactions = await this.gestionImpotEtTaxesService.verifierTransactionsEnRetard(typeImpotEnum, new Date());
      res.status(HttpStatus.OK).json(transactions);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des transactions:', error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  /**
   * 📄 Endpoint pour récupérer toutes les factures impayées liées à un impôt
   */
  @Get('factures/:typeImpot')
  async getFacturesImpayees(
    @Param('typeImpot') typeImpot: string,
    @Res() res: Response
  ) {
    try {
      // ✅ Vérification et conversion en Enum
      const typeImpotEnum = SousCategorieCharge[typeImpot as keyof typeof SousCategorieCharge];
      if (!typeImpotEnum) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Type d’impôt invalide' });
      }

      const factures = await this.gestionImpotEtTaxesService.verifierFacturesImpayees(typeImpotEnum);
      res.status(HttpStatus.OK).json(factures);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des factures impayées:', error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
  /**
   * 🔔 Endpoint pour les alertes d’échéance fiscale
   */
  @Get('alerte-echeance/:joursAvant')
  async alerteEcheances(@Param('joursAvant') joursAvant: number, @Res() res: Response) {
    try {
      const alertes = await this.gestionImpotEtTaxesService.notifierAvantEcheance(joursAvant);
      res.status(HttpStatus.OK).json(alertes);
    } catch (error) {
      console.error('❌ Erreur lors de la génération des alertes:', error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
}
