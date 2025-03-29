import { Controller, Post, Body, Get } from '@nestjs/common';
import { FactureService } from './facture.service';
import { FactureDocument } from './schema/facture.schema';

@Controller('factures')
export class FactureController {
  constructor(private readonly factureService: FactureService) {}

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
