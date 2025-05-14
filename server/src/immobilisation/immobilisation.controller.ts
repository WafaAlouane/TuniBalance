import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ImmobilisationService } from './immobilisation.service';
import { Immobilisation } from './Schema/immobilisation.schema';

@Controller('immobilisations')
export class ImmobilisationController {
  constructor(private readonly immobilisationService: ImmobilisationService) {}

  @Post()
  async create(@Body() immobilisationData: any): Promise<Immobilisation> {
    return this.immobilisationService.create(immobilisationData);
  }
  


  @Get()
  async findAll(): Promise<Immobilisation[]> {
    return this.immobilisationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Immobilisation | null> {
    return this.immobilisationService.findOne(id);
  }
}
