import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanFeature } from './entities/plan-feature.entity';
import { CreatePlanFeatureDto } from './dto/create-plan-feature.dto';
import { UpdatePlanFeatureDto } from './dto/update-plan-feature.dto';

@Injectable()
export class PlanFeaturesService {
  constructor(
    @InjectRepository(PlanFeature)
    private planFeaturesRepository: Repository<PlanFeature>,
  ) {}

  async create(createPlanFeatureDto: CreatePlanFeatureDto): Promise<PlanFeature> {
    const feature = this.planFeaturesRepository.create(createPlanFeatureDto);
    return this.planFeaturesRepository.save(feature);
  }

  async findAll(): Promise<PlanFeature[]> {
    return this.planFeaturesRepository.find();
  }

  async findOne(id: string): Promise<PlanFeature> {
    const feature = await this.planFeaturesRepository.findOneBy({ id });
    if (!feature) {
      throw new NotFoundException(`Plan Feature with ID "${id}" not found`);
    }
    return feature;
  }

  async update(id: string, updatePlanFeatureDto: UpdatePlanFeatureDto): Promise<PlanFeature> {
    const feature = await this.findOne(id);
    this.planFeaturesRepository.merge(feature, updatePlanFeatureDto);
    return this.planFeaturesRepository.save(feature);
  }

  async remove(id: string): Promise<void> {
    const result = await this.planFeaturesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Plan Feature with ID "${id}" not found`);
    }
  }
}