import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUpdate } from './entities/project-update.entity';
import { CreateProjectUpdateDto } from './dto/create-project-update.dto';

@Injectable()
export class ProjectUpdatesService {
  constructor(
    @InjectRepository(ProjectUpdate)
    private readonly projectUpdateRepository: Repository<ProjectUpdate>,
  ) {}

  async create(dto: CreateProjectUpdateDto): Promise<ProjectUpdate> {
    const update = this.projectUpdateRepository.create(dto);
    return await this.projectUpdateRepository.save(update);
  }

  async findAll(): Promise<ProjectUpdate[]> {
    return await this.projectUpdateRepository.find({
      relations: ['project', 'createdByEmployee'],
    });
  }

  async findOne(id: string): Promise<ProjectUpdate> {
    const update = await this.projectUpdateRepository.findOne({
      where: { id },
      relations: ['project', 'createdByEmployee'],
    });
    if (!update) {
      throw new NotFoundException(`ProjectUpdate with ID "${id}" not found`);
    }
    return update;
  }

  async update(
    id: string,
    dto: Partial<CreateProjectUpdateDto>,
  ): Promise<ProjectUpdate> {
    const update = await this.findOne(id);
    Object.assign(update, dto);
    return await this.projectUpdateRepository.save(update);
  }

  async remove(id: string): Promise<void> {
    const update = await this.findOne(id);
    await this.projectUpdateRepository.remove(update);
  }
}
