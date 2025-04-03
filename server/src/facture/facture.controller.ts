import { Controller, Post, Body, Get, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FactureService } from './facture.service';
import { FactureDocument } from './schema/facture.schema';

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
}