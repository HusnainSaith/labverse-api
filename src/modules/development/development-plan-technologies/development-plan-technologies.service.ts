import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DevelopmentPlanTechnology } from './entities/development-plan-technology.entity';
import { CreateDevelopmentPlanTechnologyDto } from './dto/create-development-plan-technology.dto';
import { UpdateDevelopmentPlanTechnologyDto } from './dto/update-development-plan-technology.dto';
import { SecurityUtil } from '../../../common/utils/security.util';

@Injectable()
export class DevelopmentPlanTechnologiesService {
  constructor(
    @InjectRepository(DevelopmentPlanTechnology)
    private dptRepository: Repository<DevelopmentPlanTechnology>,
  ) {}

  async create(
    createDptDto: CreateDevelopmentPlanTechnologyDto,
  ): Promise<DevelopmentPlanTechnology> {
    SecurityUtil.validateObject(createDptDto);
    const dpt = this.dptRepository.create(createDptDto);
    return this.dptRepository.save(dpt);
  }

  async findAll(): Promise<DevelopmentPlanTechnology[]> {
    return this.dptRepository.find({ relations: ['plan', 'technology'] });
  }

  async findOne(id: string): Promise<DevelopmentPlanTechnology> {
    const validId = SecurityUtil.validateId(id);
    const dpt = await this.dptRepository.findOne({
      where: { id: validId },
      relations: ['plan', 'technology'],
    });
    if (!dpt) {
      throw new NotFoundException(
        `Development Plan Technology with ID "${validId}" not found`,
      );
    }
    return dpt;
  }

  async update(
    id: string,
    updateDptDto: UpdateDevelopmentPlanTechnologyDto,
  ): Promise<DevelopmentPlanTechnology> {
    SecurityUtil.validateObject(updateDptDto);
    const dpt = await this.findOne(id);
    this.dptRepository.merge(dpt, updateDptDto);
    return this.dptRepository.save(dpt);
  }

  async remove(id: string): Promise<void> {
    const validId = SecurityUtil.validateId(id);
    const result = await this.dptRepository.delete(validId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Development Plan Technology with ID "${validId}" not found`,
      );
    }
  }
}
