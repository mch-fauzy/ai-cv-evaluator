import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from '../../services/health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return health check response with ok status', () => {
      const result = controller.getHealth();

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toBeDefined();
      expect(result.data!.status).toBe('ok');
      expect(result.data).toHaveProperty('timestamp');
      expect(result.data).toHaveProperty('uptime');
      expect(typeof result.data!.uptime).toBe('number');
      expect(typeof result.data!.timestamp).toBe('string');
    });

    it('should return valid ISO timestamp', () => {
      const result = controller.getHealth();
      const timestamp = new Date(result.data!.timestamp);

      expect(timestamp.toString()).not.toBe('Invalid Date');
    });
  });
});
