import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return message and userId', () => {
      // Mocking the request object with a userId
      const mockRequest = { userId: '12345' };

      // Call the method with the mock request object
      const result = appController.getHello(mockRequest as any);

    
    });
  });
});
