import { Test, TestingModule } from '@nestjs/testing';
import { AmortissementController } from './amortissement.controller';
import { AmortissementService } from './amortissement.service';

describe('AmortissementController', () => {
  let controller: AmortissementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmortissementController],
      providers: [AmortissementService],
    }).compile();

    controller = module.get<AmortissementController>(AmortissementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
