import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { PaiementDocument } from './Schema/paiement.schema';

@Controller('paiements')
export class PaiementController {
  constructor(private readonly paiementService: PaiementService) {}

  @Get()
  async findAll() {
    return this.paiementService.findAll(); 
  }

  @Post()
  async create(@Body() body: PaiementDocument) {
    return this.paiementService.create(body); 
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.paiementService.findById(id); // Appel à la méthode findById
  }

  @Post(':id/remove')
  async remove(@Param('id') id: string) {
    return this.paiementService.remove(id); // Appel à la méthode remove
  }
}
