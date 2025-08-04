import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DevelopmentPlanService } from './entities/development-plan-service.entity';
import { CreateDevelopmentPlanServiceDto } from './dto/create-development-plan-service.dto';
import { UpdateDevelopmentPlanServiceDto } from './dto/update-development-plan-service.dto';
import { SecurityUtil } from '../../../common/utils/security.util';

@Injectable()
export class DevelopmentPlanServicesService {
  constructor(
    @InjectRepository(DevelopmentPlanService)
    private dpsRepository: Repository<DevelopmentPlanService>,
  ) {}

  async create(
    createDpsDto: CreateDevelopmentPlanServiceDto,
  ): Promise<DevelopmentPlanService> {
    SecurityUtil.validateObject(createDpsDto);
    const dps = this.dpsRepository.create(createDpsDto);
    return this.dpsRepository.save(dps);
  }

  async findAll(): Promise<DevelopmentPlanService[]> {
    return this.dpsRepository.find({ relations: ['plan', 'service'] });
  }

  async findOne(id: string): Promise<DevelopmentPlanService> {
    const validId = SecurityUtil.validateId(id);
    const dps = await this.dpsRepository.findOne({
      where: { id: validId },
      relations: ['plan', 'service'],
    });
    if (!dps) {
      throw new NotFoundException(
        `Development Plan Service with ID "${id}" not found`,
      );
    }
    return dps;
  }

  async update(
    id: string,
    updateDpsDto: UpdateDevelopmentPlanServiceDto,
  ): Promise<DevelopmentPlanService> {
    SecurityUtil.validateObject(updateDpsDto);
    const dps = await this.findOne(id);
    this.dpsRepository.merge(dps, updateDpsDto);
    return this.dpsRepository.save(dps);
  }

  async remove(id: string): Promise<void> {
    const validId = SecurityUtil.validateId(id);
    const result = await this.dpsRepository.delete(validId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Development Plan Service with ID "${id}" not found`,
      );
    }
  }
}
