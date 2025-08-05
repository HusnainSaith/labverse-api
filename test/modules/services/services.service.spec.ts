import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from '../../../src/modules/services/services.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Service } from '../../../src/modules/services/entities/service.entity';
import { mockRepository } from '../../utils/test-helpers';

describe('ServicesService', () => {
  let service: ServicesService;
  let serviceRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        { provide: getRepositoryToken(Service), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    serviceRepository = module.get(getRepositoryToken(Service));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new service', async () => {
      const createServiceDto = {
        name: 'Web Development',
        description: 'Full stack web development',
        base_price: 5000,
      };
      const mockService = { id: 'service-id', ...createServiceDto };

      serviceRepository.create.mockReturnValue(mockService);
      serviceRepository.save.mockResolvedValue(mockService);

      const result = await service.create(createServiceDto);

      expect(result).toEqual(mockService);
      expect(serviceRepository.create).toHaveBeenCalledWith(createServiceDto);
    });
  });

  describe('findAll', () => {
    it('should return array of services', async () => {
      const mockServices = [{ id: 'service-id', name: 'Web Development' }];
      serviceRepository.find.mockResolvedValue(mockServices);

      const result = await service.findAll();

      expect(result).toEqual(mockServices);
      expect(serviceRepository.find).toHaveBeenCalled();
    });
  });
});