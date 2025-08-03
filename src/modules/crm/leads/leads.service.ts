import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  create(createLeadDto: CreateLeadDto) {
    const lead = this.leadRepository.create(createLeadDto);
    return this.leadRepository.save(lead);
  }

  findAll() {
    return this.leadRepository.find();
  }

  findOne(id: string) {
    return this.leadRepository.findOne({ where: { id } });
  }

  update(id: string, updateLeadDto: UpdateLeadDto) {
    return this.leadRepository.update(id, updateLeadDto);
  }

  remove(id: string) {
    return this.leadRepository.delete(id);
  }
}