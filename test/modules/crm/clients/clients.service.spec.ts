import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from '../../../../src/modules/crm/clients/clients.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from '../../../../src/modules/crm/clients/entities/clients.entity';
import { mockRepository } from '../../../utils/test-helpers';

describe('ClientsService', () => {
  let service: ClientsService;
  let clientRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        { provide: getRepositoryToken(Client), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    clientRepository = module.get(getRepositoryToken(Client));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const createClientDto = {
        name: 'Test Client',
        email: 'client@example.com',
        phone: '1234567890',
      };
      const mockClient = { id: 'client-id', ...createClientDto };

      clientRepository.create.mockReturnValue(mockClient);
      clientRepository.save.mockResolvedValue(mockClient);

      const result = await service.create(createClientDto);

      expect(result).toEqual(mockClient);
      expect(clientRepository.create).toHaveBeenCalledWith(createClientDto);
    });
  });

  describe('findAll', () => {
    it('should return array of clients', async () => {
      const mockClients = [{ id: 'client-id', name: 'Test Client' }];
      clientRepository.find.mockResolvedValue(mockClients);

      const result = await service.findAll();

      expect(result).toEqual(mockClients);
      expect(clientRepository.find).toHaveBeenCalled();
    });
  });
});