import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectMilestone } from './entities/project-milestone.entity';
import { CreateProjectMilestoneDto } from './dto/create-project-milestone.dto';
import { UpdateProjectMilestoneDto } from './dto/update-project-milestone.dto';

@Injectable()
export class ProjectMilestoneService {
  constructor(
    @InjectRepository(ProjectMilestone)
    private milestoneRepo: Repository<ProjectMilestone>,
  ) {}
async create(dto: CreateProjectMilestoneDto) {
  const milestone = this.milestoneRepo.create({
    name: dto.name,
    description: dto.description,
    due_date: dto.due_date,
    status: dto.status,
    project: { id: dto.project_id }, 
  });

  return this.milestoneRepo.save(milestone);
}




  findAll() {
    return this.milestoneRepo.find();
  }

  async findOne(id: string) {
    const milestone = await this.milestoneRepo.findOne({ where: { id } });
    if (!milestone) throw new NotFoundException('Milestone not found');
    return milestone;
  }

  async update(id: string, dto: UpdateProjectMilestoneDto) {
  await this.findOne(id);
  await this.milestoneRepo.update(id, dto);
  return this.findOne(id);
}


  async remove(id: string) {
    await this.findOne(id);
    return this.milestoneRepo.delete(id);
  }
}
