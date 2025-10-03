import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from '../../../../src/modules/crm/leads/leads.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Lead } from '../../../../src/modules/crm/leads/entities/lead.entity';
import { mockRepository } from '../../../utils/test-helpers';

describe('LeadsService', () => {
  let service: LeadsService;
  let leadRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        { provide: getRepositoryToken(Lead), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
    leadRepository = module.get(getRepositoryToken(Lead));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new lead', async () => {
      const createLeadDto = {
        contactPersonName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        companyName: 'Test Company',
      };
      const mockLead = { id: 'lead-id', ...createLeadDto };

      leadRepository.create.mockReturnValue(mockLead);
      leadRepository.save.mockResolvedValue(mockLead);

      const result = await service.create(createLeadDto);

      expect(result).toEqual(mockLead);
      expect(leadRepository.create).toHaveBeenCalledWith(createLeadDto);
    });
  });

  describe('findAll', () => {
    it('should return array of leads', async () => {
      const mockLeads = [{ id: 'lead-id', name: 'John Doe' }];
      leadRepository.find.mockResolvedValue(mockLeads);

      const result = await service.findAll();

      expect(result).toEqual(mockLeads);
      expect(leadRepository.find).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a lead', async () => {
      const leadId = 'lead-id';
      const updateLeadDto = { contactPersonName: 'Jane Doe' };
      const updateResult = { affected: 1 };

      leadRepository.update.mockResolvedValue(updateResult);

      const result = await service.update(leadId, updateLeadDto);

      expect(result).toEqual(updateResult);
      expect(leadRepository.update).toHaveBeenCalledWith(leadId, updateLeadDto);
    });
  });
});
