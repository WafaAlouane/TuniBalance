import { Controller, Post, Body, Get, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FactureService } from './facture.service';
import { FactureDocument } from './schema/facture.schema';


@Controller('factures')
export class FactureController {
  constructor(private readonly factureService: FactureService) {}


  @Get('client')
  async getFacturesForClient() {
    return this.factureService.findAllFacturesForClient();
  }

  @Get('fournisseur')
  async getFacturesForFournisseur() {
    return this.factureService.findAllFacturesForFournisseur();
  }

  // Create a new facture
  @Post()
  async create(@Body() factureData: any): Promise<FactureDocument> {
    return this.factureService.createFacture(factureData);
  }

  // Get all factures
  @Get()
  async getAllFactures(): Promise<FactureDocument[]> {
    return this.factureService.findAllFactures();
  }

 
}
