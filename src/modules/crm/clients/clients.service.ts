import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/clients.entity';
import { CreateClientDto } from './dto/create-clients.dto';
import { UpdateClientDto } from './dto/update-clients.dto';
import { SecurityUtil } from '../../../common/utils/security.util';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    SecurityUtil.validateObject(createClientDto);
    const client = this.clientsRepository.create(createClientDto);
    return this.clientsRepository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return this.clientsRepository.find();
  }

  async findOne(id: string): Promise<Client> {
    const validId = SecurityUtil.validateId(id);
    const client = await this.clientsRepository.findOneBy({ id: validId });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    SecurityUtil.validateObject(updateClientDto);
    const validId = SecurityUtil.validateId(id);
    const client = await this.findOne(id); // Ensures the client exists
    this.clientsRepository.merge(client, updateClientDto);
    return this.clientsRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const validId = SecurityUtil.validateId(id);
    const result = await this.clientsRepository.delete(validId);
    if (result.affected === 0) {
      throw new NotFoundException('Client not found');
    }
  }
}
