import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from '../../../../src/modules/billing/payments/payments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment, PaymentMethod } from '../../../../src/modules/billing/payments/entities/payment.entity';
import { Invoice } from '../../../../src/modules/billing/invoices/entities/invoice.entity';
import { mockRepository } from '../../../utils/test-helpers';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymentRepository: any;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: getRepositoryToken(Payment), useValue: mockRepository() },
        { provide: getRepositoryToken(Invoice), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    paymentRepository = module.get(getRepositoryToken(Payment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new payment', async () => {
      const createPaymentDto = {
        invoiceId: '550e8400-e29b-41d4-a716-446655440000',
        paymentAmount: 1000,
        paymentDate: '2024-01-01',
        paymentMethod: PaymentMethod.CREDIT_CARD,
        transactionReference: 'txn-123',
      };
      const mockInvoice = { id: '550e8400-e29b-41d4-a716-446655440000' };
      
      const invoiceRepository = module.get(getRepositoryToken(Invoice));
      invoiceRepository.findOne.mockResolvedValue(mockInvoice);
      const mockPayment = { id: 'payment-id', ...createPaymentDto };

      paymentRepository.create.mockReturnValue(mockPayment);
      paymentRepository.save.mockResolvedValue(mockPayment);

      const result = await service.create(createPaymentDto);

      expect(result).toEqual(mockPayment);
      expect(paymentRepository.create).toHaveBeenCalledWith(createPaymentDto);
    });
  });

  describe('findAll', () => {
    it('should return array of payments', async () => {
      const mockPayments = [{ id: 'payment-id', amount: 1000 }];
      paymentRepository.find.mockResolvedValue(mockPayments);

      const result = await service.findAll();

      expect(result).toEqual(mockPayments);
      expect(paymentRepository.find).toHaveBeenCalled();
    });
  });
});