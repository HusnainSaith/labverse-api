import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientNote } from './entities/client-note.entity';
import { CreateClientNoteDto } from './dto/create-client-note.dto';
import { UpdateClientNoteDto } from './dto/update-client-note.dto';

@Injectable()
export class ClientNotesService {
  constructor(
    @InjectRepository(ClientNote)
    private clientNoteRepository: Repository<ClientNote>,
  ) {}

  async create(createClientNoteDto: CreateClientNoteDto): Promise<ClientNote> {
    const clientNote = this.clientNoteRepository.create(createClientNoteDto);
    return this.clientNoteRepository.save(clientNote);
  }

  async findAll(): Promise<ClientNote[]> {
    return this.clientNoteRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findByClient(clientId: string): Promise<ClientNote[]> {
    return this.clientNoteRepository.find({
      where: { clientId },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<ClientNote> {
    const clientNote = await this.clientNoteRepository.findOne({ where: { id } });
    if (!clientNote) {
      throw new NotFoundException(`Client note with ID ${id} not found`);
    }
    return clientNote;
  }

  async update(id: string, updateClientNoteDto: UpdateClientNoteDto): Promise<ClientNote> {
    const clientNote = await this.findOne(id);
    Object.assign(clientNote, updateClientNoteDto);
    return this.clientNoteRepository.save(clientNote);
  }

  async remove(id: string): Promise<void> {
    const clientNote = await this.findOne(id);
    await this.clientNoteRepository.remove(clientNote);
  }
}