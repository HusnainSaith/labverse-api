import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DevelopmentPlan } from './entities/development-plan.entity';
import { CreateDevelopmentPlanDto } from './dto/create-development-plan.dto';
import { UpdateDevelopmentPlanDto } from './dto/update-development-plan.dto';

@Injectable()
export class DevelopmentPlansService {
  constructor(
    @InjectRepository(DevelopmentPlan)
    private developmentPlansRepository: Repository<DevelopmentPlan>,
  ) {}

  async create(createDevelopmentPlanDto: CreateDevelopmentPlanDto): Promise<DevelopmentPlan> {
    const plan = this.developmentPlansRepository.create(createDevelopmentPlanDto);
    return this.developmentPlansRepository.save(plan);
  }

  async findAll(): Promise<DevelopmentPlan[]> {
    return this.developmentPlansRepository.find();
  }

  async findOne(id: string): Promise<DevelopmentPlan> {
    const plan = await this.developmentPlansRepository.findOneBy({ id });
    if (!plan) {
      throw new NotFoundException(`Development Plan with ID "${id}" not found`);
    }
    return plan;
  }

  async update(id: string, updateDevelopmentPlanDto: UpdateDevelopmentPlanDto): Promise<DevelopmentPlan> {
    const plan = await this.findOne(id);
    this.developmentPlansRepository.merge(plan, updateDevelopmentPlanDto);
    return this.developmentPlansRepository.save(plan);
  }

  async remove(id: string): Promise<void> {
    const result = await this.developmentPlansRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Development Plan with ID "${id}" not found`);
    }
  }
}