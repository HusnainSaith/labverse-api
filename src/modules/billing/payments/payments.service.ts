import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Invoice } from '../invoices/entities/invoice.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    try {
      const { invoiceId } = createPaymentDto;

      if (invoiceId) {
        const invoice = await this.invoiceRepository.findOne({ where: { id: invoiceId } });
        if (!invoice) {
          throw new NotFoundException(`Invoice with ID "${invoiceId}" not found.`);
        }
      }

      const payment = this.paymentRepository.create(createPaymentDto);
      return await this.paymentRepository.save(payment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '23503') {
        throw new NotFoundException('Referenced invoice not found.');
      }
      throw error;
    }
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({ relations: ['invoice'] });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['invoice']
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID "${id}" not found.`);
    }
    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    try {
      if (updatePaymentDto.invoiceId) {
        const invoice = await this.invoiceRepository.findOne({ where: { id: updatePaymentDto.invoiceId } });
        if (!invoice) {
          throw new NotFoundException(`Invoice with ID "${updatePaymentDto.invoiceId}" not found.`);
        }
      }

      await this.paymentRepository.update(id, updatePaymentDto);
      return this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '23503') {
        throw new NotFoundException('Referenced invoice not found.');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.paymentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Payment with ID "${id}" not found.`);
    }
    return { message: 'Payment successfully deleted' };
  }
}