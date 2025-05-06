import { Test, TestingModule } from '@nestjs/testing';
import { GestionImpotEtTaxesService } from './gestion-impot-et-taxes.service';

describe('GestionImpotEtTaxesService', () => {
  let service: GestionImpotEtTaxesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GestionImpotEtTaxesService],
    }).compile();

    service = module.get<GestionImpotEtTaxesService>(GestionImpotEtTaxesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
