import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FactureService } from './facture.service';
import { CreateFactureDto } from './dto/create-facture.dto';

@Controller('factures')
export class FactureController {
  constructor(private readonly factureService: FactureService) {}

  @Post()
  async create(@Body() createFactureDto: CreateFactureDto) {
    return this.factureService.create(createFactureDto);
  }

  @Get()
  async findAll() {
    return this.factureService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.factureService.findOne(id);
  }
}