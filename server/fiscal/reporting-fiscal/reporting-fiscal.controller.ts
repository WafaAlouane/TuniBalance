import { Controller, Get, Param, Res, HttpStatus, Body, Post, InternalServerErrorException } from '@nestjs/common';
import { ReportingFiscalService } from './reporting-fiscal.service';
import { Response } from 'express';

@Controller('reporting-fiscal')
export class ReportingFiscalController {
  constructor(private readonly reportingFiscalService: ReportingFiscalService) {}

  /**
   * Endpoint pour générer un rapport TVA trimestriel
   */
  @Get('rapport-tva/:annee/:trimestre')
  async genererRapportTVA(
    @Param('annee') annee: number,
    @Param('trimestre') trimestre: number,
    @Res() res: Response
  ) {
    try {
      const rapport = await this.reportingFiscalService.genererRapportTVA(annee, trimestre);
      
      res.status(HttpStatus.OK).json({
        message: 'Rapport TVA généré avec succès',
        details: rapport.details
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  /**
   * Endpoint pour analyser les écarts fiscaux
   */
  @Get('analyse-ecart/:annee')
  async analyserEcartsFiscaux(@Param('annee') annee: number, @Res() res: Response) {
    try {
      const analyse = await this.reportingFiscalService.analyserEcartsFiscaux(annee);
      
      res.status(HttpStatus.OK).json({
        message: 'Analyse des écarts fiscaux réussie',
        details: analyse.details,
        interpretation: analyse.analyse
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Get('rapport-tva/:annee/:trimestre/pdf')
  async genererRapportTVAPdf(@Param('annee') annee: number, @Param('trimestre') trimestre: number, @Res() res: Response) {
    const rapport = await this.reportingFiscalService.genererRapportTVA(annee, trimestre);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Rapport_TVA_${annee}_T${trimestre}.pdf`);
    res.send(rapport.pdf);
  }

  @Get('rapport-tva/:annee/:trimestre/excel')
  async genererRapportTVAExcel(@Param('annee') annee: number, @Param('trimestre') trimestre: number, @Res() res: Response) {
    const rapport = await this.reportingFiscalService.genererRapportTVA(annee, trimestre);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Rapport_TVA_${annee}_T${trimestre}.xlsx`);
    res.send(rapport.excel);
  }

  @Get('verifier-conformite/:annee/:secteur')
  async verifierConformite(
    @Param('annee') annee: number,
    @Param('secteur') secteur: string
  ) {
    try {
      return await this.reportingFiscalService.verifierConformiteFiscaleAuto(Number(annee), secteur);
    } catch (error) {
      console.error(` Erreur de vérification fiscale (${annee}, ${secteur}) :`, error.message);
      throw new InternalServerErrorException("Erreur lors de la vérification fiscale.");
    }
  }
}
