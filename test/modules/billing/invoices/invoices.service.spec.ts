import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from '../../../../src/modules/billing/invoices/invoices.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Invoice } from '../../../../src/modules/billing/invoices/entities/invoice.entity';
import { mockRepository } from '../../../utils/test-helpers';

describe('InvoicesService', () => {
  let service: InvoicesService;
  let invoiceRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        { provide: getRepositoryToken(Invoice), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    invoiceRepository = module.get(getRepositoryToken(Invoice));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new invoice', async () => {
      const createInvoiceDto = {
        client_id: 'client-id',
        issue_date: new Date('2024-01-01'),
        due_date: new Date('2024-02-01'),
        total_amount: 1000,
      };
      const mockInvoice = { id: 'invoice-id', ...createInvoiceDto };

      invoiceRepository.create.mockReturnValue(mockInvoice);
      invoiceRepository.save.mockResolvedValue(mockInvoice);

      const result = await service.create(createInvoiceDto);

      expect(result).toEqual(mockInvoice);
      expect(invoiceRepository.create).toHaveBeenCalledWith(createInvoiceDto);
    });
  });
});
