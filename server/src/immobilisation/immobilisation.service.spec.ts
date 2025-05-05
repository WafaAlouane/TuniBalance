import { Test, TestingModule } from '@nestjs/testing';
import { ImmobilisationService } from './immobilisation.service';

describe('ImmobilisationService', () => {
  let service: ImmobilisationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImmobilisationService],
    }).compile();

    service = module.get<ImmobilisationService>(ImmobilisationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
