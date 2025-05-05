import { Test, TestingModule } from '@nestjs/testing';
import { AmortissementService } from './amortissement.service';

describe('AmortissementService', () => {
  let service: AmortissementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmortissementService],
    }).compile();

    service = module.get<AmortissementService>(AmortissementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
