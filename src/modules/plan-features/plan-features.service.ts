import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanFeature } from './entities/plan-feature.entity';
import { CreatePlanFeatureDto } from './dto/create-plan-feature.dto';
import { UpdatePlanFeatureDto } from './dto/update-plan-feature.dto';
import { SecurityUtil } from '../../common/utils/security.util';

@Injectable()
export class PlanFeaturesService {
  constructor(
    @InjectRepository(PlanFeature)
    private planFeaturesRepository: Repository<PlanFeature>,
  ) {}

  async create(
    createPlanFeatureDto: CreatePlanFeatureDto,
  ): Promise<PlanFeature> {
    SecurityUtil.validateObject(createPlanFeatureDto);
    const feature = this.planFeaturesRepository.create(createPlanFeatureDto);
    return this.planFeaturesRepository.save(feature);
  }

  async findAll(): Promise<PlanFeature[]> {
    return this.planFeaturesRepository.find();
  }

  async findOne(id: string): Promise<PlanFeature> {
    const validId = SecurityUtil.validateId(id);
    const feature = await this.planFeaturesRepository.findOneBy({ id: validId });
    if (!feature) {
      throw new NotFoundException(`Plan Feature with ID "${id}" not found`);
    }
    return feature;
  }

  async update(
    id: string,
    updatePlanFeatureDto: UpdatePlanFeatureDto,
  ): Promise<PlanFeature> {
    SecurityUtil.validateObject(updatePlanFeatureDto);
    const feature = await this.findOne(id);
    this.planFeaturesRepository.merge(feature, updatePlanFeatureDto);
    return this.planFeaturesRepository.save(feature);
  }

  async remove(id: string): Promise<void> {
    const validId = SecurityUtil.validateId(id);
    const result = await this.planFeaturesRepository.delete(validId);
    if (result.affected === 0) {
      throw new NotFoundException(`Plan Feature with ID "${id}" not found`);
    }
  }
}
