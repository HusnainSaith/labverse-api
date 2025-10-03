import { Test, TestingModule } from '@nestjs/testing';
import { PlanFeaturesService } from '../../../src/modules/plan-features/plan-features.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlanFeature } from '../../../src/modules/plan-features/entities/plan-feature.entity';
import { mockRepository } from '../../utils/test-helpers';

describe('PlanFeaturesService', () => {
  let service: PlanFeaturesService;
  let planFeatureRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanFeaturesService,
        {
          provide: getRepositoryToken(PlanFeature),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<PlanFeaturesService>(PlanFeaturesService);
    planFeatureRepository = module.get(getRepositoryToken(PlanFeature));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new plan feature', async () => {
      const createFeatureDto = {
        name: 'User Authentication',
        description: 'Login and registration system',
        estimatedHours: 20,
      };
      const mockFeature = { id: 'feature-id', ...createFeatureDto };

      planFeatureRepository.create.mockReturnValue(mockFeature);
      planFeatureRepository.save.mockResolvedValue(mockFeature);

      const result = await service.create(createFeatureDto);

      expect(result).toEqual(mockFeature);
      expect(planFeatureRepository.create).toHaveBeenCalledWith(
        createFeatureDto,
      );
    });
  });
});
