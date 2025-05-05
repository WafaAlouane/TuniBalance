import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { AmortissementService } from './amortissement.service';

@Controller('amortissement')
export class AmortissementController {
  constructor(private readonly amortissementService: AmortissementService) {}

  // ===== IMMOBILISATION =====

  @Post('immobilisation/lineaire/:id')
  genererLineaireImmobilisation(@Param('id') id: string) {
    return this.amortissementService.calculerAmortissementLineaireImmobilisation(id);
  }

  @Post('immobilisation/degressif/:id')
  genererDegressifImmobilisation(@Param('id') id: string) {
    return this.amortissementService.calculerAmortissementDegressifImmobilisation(id);
  }

  @Post('immobilisation/variable/:id')
  genererVariableImmobilisation(
    @Param('id') id: string,
    @Body('tauxs') tauxs: number[]
  ) {
    return this.amortissementService.calculerAmortissementVariableImmobilisation(id, tauxs);
  }

   // Récupérer tous les amortissements
   @Get()
   getAllAmortissements() {
     return this.amortissementService.getAmortissements();
   }
 
   // Récupérer un amortissement par ID
   @Get(':id')
   getAmortissement(@Param('id') id: string) {
     return this.amortissementService.getAmortissementById(id);
   }
 // Controller : Récupérer les amortissements par ID
@Get('grouped/:id')
getAmortissementsGroupes(@Param('id') id: string) {
  return this.amortissementService.getAmortissementsParId(id);
}


  // ===== EMPRUNT =====

  @Post('emprunt/lineaire/:id')
  genererLineaireEmprunt(@Param('id') id: string) {
    return this.amortissementService.calculerAmortissementLineaireEmprunt(id);
  }

  @Post('emprunt/degressif/:id')
  genererDegressifEmprunt(@Param('id') id: string) {
    return this.amortissementService.calculerAmortissementDegressifEmprunt(id);
  }
}
