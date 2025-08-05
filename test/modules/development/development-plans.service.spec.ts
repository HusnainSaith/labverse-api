import { Test, TestingModule } from '@nestjs/testing';
import { DevelopmentPlansService } from '../../../src/modules/development/development-plans/development-plans.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DevelopmentPlan } from '../../../src/modules/development/development-plans/entities/development-plan.entity';
import { mockRepository } from '../../utils/test-helpers';

describe('DevelopmentPlansService', () => {
  let service: DevelopmentPlansService;
  let developmentPlanRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevelopmentPlansService,
        { provide: getRepositoryToken(DevelopmentPlan), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<DevelopmentPlansService>(DevelopmentPlansService);
    developmentPlanRepository = module.get(getRepositoryToken(DevelopmentPlan));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new development plan', async () => {
      const createPlanDto = {
        name: 'E-commerce Platform',
        description: 'Full e-commerce solution',
        estimatedHours: 200,
        price: 15000,
      };
      const mockPlan = { id: 'plan-id', ...createPlanDto };

      developmentPlanRepository.create.mockReturnValue(mockPlan);
      developmentPlanRepository.save.mockResolvedValue(mockPlan);

      const result = await service.create(createPlanDto);

      expect(result).toEqual(mockPlan);
      expect(developmentPlanRepository.create).toHaveBeenCalledWith(createPlanDto);
    });
  });

  describe('findAll', () => {
    it('should return array of development plans', async () => {
      const mockPlans = [{ id: 'plan-id', name: 'E-commerce Platform' }];
      developmentPlanRepository.find.mockResolvedValue(mockPlans);

      const result = await service.findAll();

      expect(result).toEqual(mockPlans);
      expect(developmentPlanRepository.find).toHaveBeenCalled();
    });
  });
});