import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { SecurityUtil } from '../../../common/utils/security.util';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    SecurityUtil.validateObject(createInvoiceDto);
    try {
      const invoice = this.invoicesRepository.create(createInvoiceDto);
      return await this.invoicesRepository.save(invoice);
    } catch (error) {
      if (error.code === '23503') {
        throw new NotFoundException(
          'Referenced client, project, or quotation not found.',
        );
      }
      if (error.code === '23505') {
        throw new ConflictException('Invoice number already exists.');
      }
      throw error;
    }
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoicesRepository.find({
      relations: ['client', 'project', 'quotation'],
    });
  }

  async findOne(id: string): Promise<Invoice> {
    const validId = SecurityUtil.validateId(id);
    const invoice = await this.invoicesRepository.findOne({
      where: { id: validId },
      relations: ['client', 'project', 'quotation'],
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID "${id}" not found`);
    }
    return invoice;
  }

  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    SecurityUtil.validateObject(updateInvoiceDto);
    const validId = SecurityUtil.validateId(id);
    try {
      const invoice = await this.findOne(id);
      this.invoicesRepository.merge(invoice, updateInvoiceDto);
      return await this.invoicesRepository.save(invoice);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '23503') {
        throw new NotFoundException(
          'Referenced client, project, or quotation not found.',
        );
      }
      if (error.code === '23505') {
        throw new ConflictException('Invoice number already exists.');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const validId = SecurityUtil.validateId(id);
    const result = await this.invoicesRepository.delete(validId);
    if (result.affected === 0) {
      throw new NotFoundException(`Invoice with ID "${id}" not found`);
    }
    return { message: 'Invoice successfully deleted' };
  }
}
