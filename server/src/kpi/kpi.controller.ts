import { Controller, Get, Query } from '@nestjs/common';
import { TransactionsService } from 'src/transactions/transactions.service';
import { KpiService } from './kpi.service';

@Controller('kpi')
export class KpiController {
      constructor(private readonly kpiService: KpiService) {}
    
   /**
   * Route pour calculer la marge brute par année.
   * @param annee - Année pour laquelle calculer la marge brute
   * @returns Marge brute pour l'année spécifiée
   */
  @Get('marge-brute')
  async getMargeBrute(@Query('annee') annee: number): Promise<{ margeBrute: number }> {
    try {
      const margeBrute = await this.kpiService.calculerMargeBruteAvecCA(annee);
      return { margeBrute };
    } catch (error) {
      console.error('Erreur lors de la récupération de la marge brute :', error.message);
      throw error;
    }
  }

  /**
   * Route pour calculer la marge nette par année.
   * @param annee - Année pour laquelle calculer la marge nette
   * @returns Marge nette pour l'année spécifiée
   */
  @Get('marge-nette')
  async getMargeNette(@Query('annee') annee: number): Promise<{ margeNette: number }> {
    try {
      const margeNette = await this.kpiService.calculerMargeNette(annee);
      return { margeNette };
    } catch (error) {
      console.error('Erreur lors de la récupération de la marge nette :', error.message);
      throw error;
    }
  }

      @Get('rentabilite-economique')
  async getRentabiliteEconomique(@Query('annee') annee: number): Promise<{ rentabiliteEconomique: number }> {
    const rentabiliteEconomique = await this.kpiService.calculerRentabiliteEconomique(annee);
    return { rentabiliteEconomique };
  }

  /**
   * Endpoint pour calculer le taux d'endettement
   * @param annee - Année pour laquelle calculer le taux d'endettement
   */
  @Get('taux-endettement')
  async getTauxEndettement(@Query('annee') annee: number): Promise<{ tauxEndettement: number }> {
    const tauxEndettement = await this.kpiService.calculerTauxEndettement(annee);
    return { tauxEndettement };
  }


  @Get('liquidite-generale')
async getLiquiditeGenerale(@Query('annee') annee: number): Promise<{ liquiditeGenerale: number }> {
  const liquiditeGenerale = await this.kpiService.calculerLiquiditeGenerale(annee);
  return { liquiditeGenerale };
}
@Get('dso')
async getDSO(@Query('annee') annee: number): Promise<{ dso: number }> {
  const dso = await this.kpiService.calculerDSO(annee);
  return { dso };
}

@Get('roi')
async getROI(@Query('annee') annee: number): Promise<{ roi: number }> {
  const roi = await this.kpiService.calculerROI(annee);
  return { roi };
}

@Get('taux-croissance-ca')
async getTauxCroissanceCA(@Query('annee') annee: number): Promise<{ tauxCroissance: number }> {
  const tauxCroissance = await this.kpiService.calculerTauxCroissanceCA(annee);
  return { tauxCroissance };
}

/**
   * Endpoint pour récupérer le taux de marge commerciale
   * @param annee - L'année pour laquelle calculer la marge
   * @returns Le taux de marge commerciale en pourcentage
   */
@Get('taux-marge-commerciale')
async getTauxMargeCommerciale(@Query('annee') annee: number): Promise<{ tauxMargeCommerciale: number }> {
  try {
    const tauxMargeCommerciale = await this.kpiService.calculerTauxMargeCommerciale(annee);
    return { tauxMargeCommerciale };
  } catch (error) {
    console.error(`Erreur lors de la récupération du taux de marge commerciale :`, error.message);
    throw error;
  }
}
}
