import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const invoice = this.invoicesRepository.create(createInvoiceDto);
    // You might add logic here to generate invoice_number if not provided
    return this.invoicesRepository.save(invoice);
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoicesRepository.find({
      relations: ['client', 'project', 'quotation'],
    });
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOne({
      where: { id },
      relations: ['client', 'project', 'quotation'],
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID "${id}" not found`);
    }
    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);
    this.invoicesRepository.merge(invoice, updateInvoiceDto);
    return this.invoicesRepository.save(invoice);
  }

  async remove(id: string): Promise<void> {
    const result = await this.invoicesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Invoice with ID "${id}" not found`);
    }
  }
}