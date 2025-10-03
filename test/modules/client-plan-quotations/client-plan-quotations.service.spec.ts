import { Test, TestingModule } from '@nestjs/testing';
import { ClientPlanQuotationsService } from '../../../src/modules/client-plan-quotations/client-plan-quotations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientPlanQuotation } from '../../../src/modules/client-plan-quotations/entities/client-plan-quotation.entity';
import { mockRepository } from '../../utils/test-helpers';

describe('ClientPlanQuotationsService', () => {
  let service: ClientPlanQuotationsService;
  let quotationRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientPlanQuotationsService,
        {
          provide: getRepositoryToken(ClientPlanQuotation),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<ClientPlanQuotationsService>(
      ClientPlanQuotationsService,
    );
    quotationRepository = module.get(getRepositoryToken(ClientPlanQuotation));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new quotation', async () => {
      const createQuotationDto = {
        client_id: 'client-id',
        plan_id: 'plan-id',
        discount_percent: 10,
        total_amount: 9000,
      };
      const mockQuotation = { id: 'quotation-id', ...createQuotationDto };

      quotationRepository.create.mockReturnValue(mockQuotation);
      quotationRepository.save.mockResolvedValue(mockQuotation);

      const result = await service.create(createQuotationDto);

      expect(result).toEqual(mockQuotation);
      expect(quotationRepository.create).toHaveBeenCalledWith(
        createQuotationDto,
      );
    });
  });
});
