import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceItem } from './entities/invoice-item.entity';
import { CreateInvoiceItemDto } from './dto/create-invoice-item.dto';

@Injectable()
export class InvoiceItemsService {
  constructor(
    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepository: Repository<InvoiceItem>,
  ) {}

  async create(dto: CreateInvoiceItemDto): Promise<InvoiceItem> {
    const item = this.invoiceItemRepository.create(dto);
    return await this.invoiceItemRepository.save(item);
  }

  async findAll(): Promise<InvoiceItem[]> {
    return await this.invoiceItemRepository.find({
      relations: ['invoice', 'service'],
    });
  }

  async findOne(id: string): Promise<InvoiceItem> {
    const item = await this.invoiceItemRepository.findOne({
      where: { id },
      relations: ['invoice', 'service'],
    });
    if (!item) throw new NotFoundException(`Invoice item with ID ${id} not found`);
    return item;
  }

  async update(id: string, dto: Partial<CreateInvoiceItemDto>): Promise<InvoiceItem> {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return await this.invoiceItemRepository.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.invoiceItemRepository.remove(item);
  }
}
