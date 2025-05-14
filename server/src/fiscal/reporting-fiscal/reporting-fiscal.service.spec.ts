import { Test, TestingModule } from '@nestjs/testing';
import { ReportingFiscalService } from './reporting-fiscal.service';

describe('ReportingFiscalService', () => {
  let service: ReportingFiscalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportingFiscalService],
    }).compile();

    service = module.get<ReportingFiscalService>(ReportingFiscalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
