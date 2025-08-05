import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from '../../../../src/modules/billing/invoices/invoices.controller';
import { InvoicesService } from '../../../../src/modules/billing/invoices/invoices.service';
import { InvoiceStatus } from '../../../../src/modules/billing/invoices/enums/invoice-status.enum';

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let invoicesService: InvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        {
          provide: InvoicesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
    invoicesService = module.get<InvoicesService>(InvoicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an invoice', async () => {
      const createInvoiceDto = {
        client_id: 'client-id',
        issue_date: new Date('2024-01-01'),
        due_date: new Date('2024-02-01'),
        total_amount: 1000,
      };
      const mockInvoice = {
        id: 'invoice-id',
        invoice_number: 'INV-001',
        client_id: 'client-id',
        project_id: null,
        quotation_id: null,
        status: InvoiceStatus.UNPAID,
        issue_date: new Date('2024-01-01'),
        due_date: new Date('2024-02-01'),
        total_amount: 1000,
        paid_amount: 0,
        created_at: new Date(),
        updated_at: new Date(),
        client: null,
        project: null,
        quotation: null,
        invoiceItems: [],
        payments: [],
      };

      jest.spyOn(invoicesService, 'create').mockResolvedValue(mockInvoice);

      const result = await controller.create(createInvoiceDto);

      expect(result).toEqual(mockInvoice);
      expect(invoicesService.create).toHaveBeenCalledWith(createInvoiceDto);
    });
  });
});