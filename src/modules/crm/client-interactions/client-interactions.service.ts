import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientInteraction } from './entities/client-interaction.entity';
import { CreateClientInteractionDto } from './dto/create-client-interaction.dto';
import { UpdateClientInteractionDto } from './dto/update-client-interaction.dto';
import { SecurityUtil } from '../../../common/utils/security.util';

@Injectable()
export class ClientInteractionsService {
  constructor(
    @InjectRepository(ClientInteraction)
    private clientInteractionRepository: Repository<ClientInteraction>,
  ) {}

  async create(
    createClientInteractionDto: CreateClientInteractionDto,
  ): Promise<ClientInteraction> {
    SecurityUtil.validateObject(createClientInteractionDto);
    const clientInteraction = this.clientInteractionRepository.create(
      createClientInteractionDto,
    );
    return this.clientInteractionRepository.save(clientInteraction);
  }

  async findAll(): Promise<ClientInteraction[]> {
    return this.clientInteractionRepository.find({
      order: { interactionDate: 'DESC' },
    });
  }

  async findByClient(clientId: string): Promise<ClientInteraction[]> {
    const validClientId = SecurityUtil.validateId(clientId);
    return this.clientInteractionRepository.find({
      where: { clientId: validClientId },
      order: { interactionDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ClientInteraction> {
    const validId = SecurityUtil.validateId(id);
    const clientInteraction = await this.clientInteractionRepository.findOne({
      where: { id: validId },
    });
    if (!clientInteraction) {
      throw new NotFoundException(`Client interaction with ID ${id} not found`);
    }
    return clientInteraction;
  }

  async update(
    id: string,
    updateClientInteractionDto: UpdateClientInteractionDto,
  ): Promise<ClientInteraction> {
    SecurityUtil.validateObject(updateClientInteractionDto);
    const clientInteraction = await this.findOne(id);
    Object.assign(clientInteraction, updateClientInteractionDto);
    return this.clientInteractionRepository.save(clientInteraction);
  }

  async remove(id: string): Promise<void> {
    const validId = SecurityUtil.validateId(id);
    const clientInteraction = await this.findOne(id);
    await this.clientInteractionRepository.remove(clientInteraction);
  }
}
