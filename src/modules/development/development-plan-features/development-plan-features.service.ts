import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DevelopmentPlanFeature } from './entities/development-plan-feature.entity';
import { CreateDevelopmentPlanFeatureDto } from './dto/create-development-plan-feature.dto';
import { UpdateDevelopmentPlanFeatureDto } from './dto/update-development-plan-feature.dto';
import { SecurityUtil } from '../../../common/utils/security.util';

@Injectable()
export class DevelopmentPlanFeaturesService {
  constructor(
    @InjectRepository(DevelopmentPlanFeature)
    private dpfRepository: Repository<DevelopmentPlanFeature>,
  ) {}

  async create(
    createDpfDto: CreateDevelopmentPlanFeatureDto,
  ): Promise<DevelopmentPlanFeature> {
    SecurityUtil.validateObject(createDpfDto);
    const dpf = this.dpfRepository.create(createDpfDto);
    return this.dpfRepository.save(dpf);
  }

  async findAll(): Promise<DevelopmentPlanFeature[]> {
    return this.dpfRepository.find({ relations: ['plan', 'feature'] }); // Include related entities
  }

  async findOne(id: string): Promise<DevelopmentPlanFeature> {
    const validId = SecurityUtil.validateId(id);
    const dpf = await this.dpfRepository.findOne({
      where: { id: validId },
      relations: ['plan', 'feature'],
    });
    if (!dpf) {
      throw new NotFoundException(
        `Development Plan Feature with ID "${validId}" not found`,
      );
    }
    return dpf;
  }

  async update(
    id: string,
    updateDpfDto: UpdateDevelopmentPlanFeatureDto,
  ): Promise<DevelopmentPlanFeature> {
    SecurityUtil.validateObject(updateDpfDto);
    const dpf = await this.findOne(id);
    this.dpfRepository.merge(dpf, updateDpfDto);
    return this.dpfRepository.save(dpf);
  }

  async remove(id: string): Promise<void> {
    const validId = SecurityUtil.validateId(id);
    const result = await this.dpfRepository.delete(validId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Development Plan Feature with ID "${validId}" not found`,
      );
    }
  }
}
