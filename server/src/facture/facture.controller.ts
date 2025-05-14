import { Controller, Post, Body, Get, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { FactureService } from './facture.service';
import { FactureDocument } from './Schema/facture.schema';

@Controller('factures')
export class FactureController {
  constructor(private readonly factureService: FactureService) {}

  // Récupérer les factures pour les clients
  @Get('client')
  async getFacturesForClient() {
    return this.factureService.findAllFacturesForClient();
  }

  // Récupérer les factures pour les fournisseurs
  @Get('fournisseur')
  async getFacturesForFournisseur() {
    return this.factureService.findAllFacturesForFournisseur();
  }

  // Créer une nouvelle facture
  @Post()
  async create(@Body() factureData: any): Promise<FactureDocument> {
    return this.factureService.createFacture(factureData);
  }

  // Récupérer toutes les factures
  @Get()
  async getAllFactures(): Promise<FactureDocument[]> {
    return this.factureService.findAllFactures();
  }

     /**
   * Route pour calculer le chiffre d'affaires
   * @param annee - Année optionnelle pour filtrer le chiffre d'affaires
   */
     @Get('chiffre-affaires')
     async getChiffreAffaires(@Query('annee') annee?: number): Promise<{ chiffreAffaires: number }> {
       try {
         const chiffreAffaires = await this.factureService.calculerChiffreAffaires(annee);
         return { chiffreAffaires };
       } catch (error) {
         console.error('Erreur lors de la récupération du chiffre d’affaires :', error.message);
         throw error;
       }
     }
}