import { Test, TestingModule } from '@nestjs/testing';
import { ReportingFiscalController } from './reporting-fiscal.controller';

describe('ReportingFiscalController', () => {
  let controller: ReportingFiscalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportingFiscalController],
    }).compile();

    controller = module.get<ReportingFiscalController>(ReportingFiscalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
