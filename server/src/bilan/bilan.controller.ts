import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BilanService } from './bilan.service';
import { BilanDocument } from './schema/bilan.schema';
import { ParseIntPipe } from '@nestjs/common';

@Controller('bilan')
export class BilanController {
  constructor(private readonly bilanService: BilanService) {}

  /**
   * Endpoint pour générer le bilan de l'année actuelle.
   * Méthode HTTP : POST
   */
 /* @Post('generate')
  async generateBilanForCurrentYear(): Promise<BilanDocument> {
    return await this.bilanService.generateBilanForCurrentYear();
  }*/

    @Post('generate')
async generateBilan(@Query('annee') annee: number): Promise<BilanDocument> {
  return await this.bilanService.generateBilanForYear(annee);
}


  /**
   * Endpoint pour récupérer les bilans par année.
   * Méthode HTTP : GET
   * @param annee - Année du bilan
   */
  @Get(':annee')
  async getBilanByYear(@Param('annee', ParseIntPipe) annee: number = 2025): Promise<BilanDocument[]> {
    // If `annee` is invalid or missing, use 2025 as default
    const year = isNaN(annee) ? 2025 : annee;
    return await this.bilanService.findBilanByYear(year);
  }
}
