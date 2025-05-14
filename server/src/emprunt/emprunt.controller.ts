import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EmpruntService } from './emprunt.service';
import { Emprunt } from './Schema/emprunt.schema';

@Controller('emprunt')
export class EmpruntController {
  constructor(private readonly service: EmpruntService) {}

  @Post()
  create(@Body() body: Partial<Emprunt>) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post('generer-paiements/:id')
  genererPaiements(@Param('id') id: string) {
    return this.service.calculerAnnuitesConstantes(id);
  }
}
