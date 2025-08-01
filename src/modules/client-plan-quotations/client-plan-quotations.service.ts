import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientPlanQuotation } from './entities/client-plan-quotation.entity';
import { CreateClientPlanQuotationDto } from './dto/create-client-plan-quotation.dto';
import { UpdateClientPlanQuotationDto } from './dto/update-client-plan-quotation.dto';

@Injectable()
export class ClientPlanQuotationsService {
  constructor(
    @InjectRepository(ClientPlanQuotation)
    private clientPlanQuotationsRepository: Repository<ClientPlanQuotation>,
  ) {}

  async create(createDto: CreateClientPlanQuotationDto): Promise<ClientPlanQuotation> {
    const quotation = this.clientPlanQuotationsRepository.create(createDto);
    return this.clientPlanQuotationsRepository.save(quotation);
  }

  async findAll(): Promise<ClientPlanQuotation[]> {
    return this.clientPlanQuotationsRepository.find({
      relations: ['client', 'plan', 'createdBy'],
    });
  }

  async findOne(id: string): Promise<ClientPlanQuotation> {
    const quotation = await this.clientPlanQuotationsRepository.findOne({
      where: { id },
      relations: ['client', 'plan', 'createdBy'],
    });
    if (!quotation) {
      throw new NotFoundException(`Client Plan Quotation with ID "${id}" not found`);
    }
    return quotation;
  }

  async update(id: string, updateDto: UpdateClientPlanQuotationDto): Promise<ClientPlanQuotation> {
    const quotation = await this.findOne(id);
    this.clientPlanQuotationsRepository.merge(quotation, updateDto);
    return this.clientPlanQuotationsRepository.save(quotation);
  }

  async remove(id: string): Promise<void> {
    const result = await this.clientPlanQuotationsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client Plan Quotation with ID "${id}" not found`);
    }
  }
}