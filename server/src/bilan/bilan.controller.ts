import { Controller, Post, Get } from '@nestjs/common';
import { BilanService } from './bilan.service';
import { BilanDocument } from './schema/bilan.schema';

@Controller('bilan')
export class BilanController {
  constructor(private readonly bilanService: BilanService) {}

  @Post()
  async createBilan(): Promise<BilanDocument> {
    return this.bilanService.calculerBilan();
  }

  @Get()
  async getAllBilans(): Promise<BilanDocument[]> {
    return this.bilanService.findAllBilans();
  }
}
