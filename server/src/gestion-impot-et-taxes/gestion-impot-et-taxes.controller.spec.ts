import { Test, TestingModule } from '@nestjs/testing';
import { GestionImpotEtTaxesController } from './gestion-impot-et-taxes.controller';

describe('GestionImpotEtTaxesController', () => {
  let controller: GestionImpotEtTaxesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GestionImpotEtTaxesController],
    }).compile();

    controller = module.get<GestionImpotEtTaxesController>(GestionImpotEtTaxesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
