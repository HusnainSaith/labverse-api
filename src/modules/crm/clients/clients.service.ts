import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/clients.entity';
import { CreateClientDto } from './dto/create-clients.dto';
import { UpdateClientDto } from './dto/update-clients.dto';
import { ValidationUtil } from '../../../common/utils/validation.util';
import { SafeLogger } from '../../../common/utils/logger.util';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(dto: CreateClientDto): Promise<{ success: boolean; message: string; data: Client }> {
    ValidationUtil.validateString(dto.name, 'name', 2, 100);
    ValidationUtil.validateEmail(dto.email);
    if (dto.phone) ValidationUtil.validatePhone(dto.phone);
    if (dto.company) ValidationUtil.validateString(dto.company, 'company', 2, 100);
    if (dto.address) ValidationUtil.validateString(dto.address, 'address', 5, 255);
    if (dto.website) ValidationUtil.validateUrl(dto.website, 'website');

    // Check for duplicate email
    const existingClient = await this.clientsRepository.findOne({ where: { email: dto.email.toLowerCase().trim() } });
    if (existingClient) {
      throw new ConflictException('Client with this email already exists');
    }

    const client = this.clientsRepository.create({
      ...dto,
      name: ValidationUtil.sanitizeString(dto.name),
      email: ValidationUtil.sanitizeString(dto.email.toLowerCase()),
      company: dto.company ? ValidationUtil.sanitizeString(dto.company) : undefined,
      address: dto.address ? ValidationUtil.sanitizeString(dto.address) : undefined,
    });
    
    const savedClient = await this.clientsRepository.save(client);
    SafeLogger.log(`Client created: ${dto.name} (${dto.email})`, 'ClientsService');
    
    return ValidationUtil.createSuccessResponse('Client created successfully', savedClient);
  }

  async findAll(): Promise<{ success: boolean; message: string; data: Client[] }> {
    const clients = await this.clientsRepository.find({ order: { created_at: 'DESC' } });
    return ValidationUtil.createSuccessResponse('Clients retrieved successfully', clients);
  }

  async findOne(id: string): Promise<{ success: boolean; message: string; data: Client }> {
    ValidationUtil.validateObjectId(id, 'clientId');
    
    const client = await this.clientsRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    
    return ValidationUtil.createSuccessResponse('Client retrieved successfully', client);
  }

  async update(id: string, dto: UpdateClientDto): Promise<{ success: boolean; message: string; data: Client }> {
    ValidationUtil.validateObjectId(id, 'clientId');
    
    if (dto.name) ValidationUtil.validateString(dto.name, 'name', 2, 100);
    if (dto.email) ValidationUtil.validateEmail(dto.email);
    if (dto.phone) ValidationUtil.validatePhone(dto.phone);
    if (dto.company) ValidationUtil.validateString(dto.company, 'company', 2, 100);
    if (dto.address) ValidationUtil.validateString(dto.address, 'address', 5, 255);
    if (dto.website) ValidationUtil.validateUrl(dto.website, 'website');

    const client = await this.clientsRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Check for duplicate email if email is being updated
    if (dto.email && dto.email.toLowerCase().trim() !== client.email) {
      const existingClient = await this.clientsRepository.findOne({ where: { email: dto.email.toLowerCase().trim() } });
      if (existingClient) {
        throw new ConflictException('Client with this email already exists');
      }
    }

    // Sanitize input data
    const updateData = {
      ...dto,
      name: dto.name ? ValidationUtil.sanitizeString(dto.name) : undefined,
      email: dto.email ? ValidationUtil.sanitizeString(dto.email.toLowerCase()) : undefined,
      company: dto.company ? ValidationUtil.sanitizeString(dto.company) : undefined,
      address: dto.address ? ValidationUtil.sanitizeString(dto.address) : undefined,
    };

    Object.assign(client, updateData);
    const updatedClient = await this.clientsRepository.save(client);
    
    SafeLogger.log(`Client updated: ${client.name} (ID: ${id})`, 'ClientsService');
    return ValidationUtil.createSuccessResponse('Client updated successfully', updatedClient);
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    ValidationUtil.validateObjectId(id, 'clientId');
    
    const client = await this.clientsRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    await this.clientsRepository.delete(id);
    SafeLogger.log(`Client deleted: ${client.name} (ID: ${id})`, 'ClientsService');
    
    return ValidationUtil.createSuccessResponse('Client deleted successfully');
  }
}
