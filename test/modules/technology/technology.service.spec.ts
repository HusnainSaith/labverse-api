import { Test, TestingModule } from '@nestjs/testing';
import { TechnologiesService } from '../../../src/modules/technology/technology.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Technology } from '../../../src/modules/technology/entities/technology.entity';
import { mockRepository } from '../../utils/test-helpers';

describe('TechnologiesService', () => {
  let service: TechnologiesService;
  let technologyRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TechnologiesService,
        { provide: getRepositoryToken(Technology), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<TechnologiesService>(TechnologiesService);
    technologyRepository = module.get(getRepositoryToken(Technology));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new technology', async () => {
      const createTechnologyDto = {
        name: 'React',
        description: 'JavaScript library',
        category: 'Frontend',
      };
      const mockTechnology = { id: 'tech-id', ...createTechnologyDto };

      technologyRepository.create.mockReturnValue(mockTechnology);
      technologyRepository.save.mockResolvedValue(mockTechnology);

      const result = await service.create(createTechnologyDto);

      expect(result).toEqual(mockTechnology);
      expect(technologyRepository.create).toHaveBeenCalledWith(createTechnologyDto);
    });
  });

  describe('findAll', () => {
    it('should return array of technologies', async () => {
      const mockTechnologies = [{ id: 'tech-id', name: 'React' }];
      technologyRepository.find.mockResolvedValue(mockTechnologies);

      const result = await service.findAll();

      expect(result).toEqual(mockTechnologies);
      expect(technologyRepository.find).toHaveBeenCalled();
    });
  });
});