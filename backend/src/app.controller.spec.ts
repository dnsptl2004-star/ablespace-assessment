import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return health check status', () => {
      const res = appController.healthCheck();
      expect(res.status).toBe('ok');
      expect(res.message).toContain('TaskMaster Pro API');
    });
  });
});
