import { Test, TestingModule } from '@nestjs/testing';
import { ImmobilisationController } from './immobilisation.controller';
import { ImmobilisationService } from './immobilisation.service';

describe('ImmobilisationController', () => {
  let controller: ImmobilisationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImmobilisationController],
      providers: [ImmobilisationService],
    }).compile();

    controller = module.get<ImmobilisationController>(ImmobilisationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
