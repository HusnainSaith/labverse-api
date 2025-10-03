import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseStudy } from './entities/case-study.entity';
import { CreateCaseStudyDto } from './dto/create-case-study.dto';
import { UpdateCaseStudyDto } from './dto/update-case-study.dto';
import { SecurityUtil } from '../../../common/utils/security.util';

@Injectable()
export class CaseStudiesService {
  constructor(
    @InjectRepository(CaseStudy)
    private caseStudyRepository: Repository<CaseStudy>,
  ) {}

  async create(createCaseStudyDto: CreateCaseStudyDto): Promise<CaseStudy> {
    try {
      SecurityUtil.validateObject(createCaseStudyDto);
      const sanitizedSlug = SecurityUtil.sanitizeString(
        createCaseStudyDto.slug,
      );
      const existingSlug = await this.caseStudyRepository.findOne({
        where: { slug: sanitizedSlug },
      });
      if (existingSlug) {
        throw new ConflictException(
          `Case study with slug "${createCaseStudyDto.slug}" already exists.`,
        );
      }

      const caseStudy = this.caseStudyRepository.create(createCaseStudyDto);
      return await this.caseStudyRepository.save(caseStudy);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error.code === '23503') {
        throw new NotFoundException('Category not found.');
      }
      throw error;
    }
  }

  async findAll(): Promise<CaseStudy[]> {
    return this.caseStudyRepository.find({ relations: ['category'] });
  }

  async findOne(id: string): Promise<CaseStudy> {
    const validId = SecurityUtil.validateId(id);
    const caseStudy = await this.caseStudyRepository.findOne({
      where: { id: validId },
      relations: ['category'],
    });
    if (!caseStudy) {
      throw new NotFoundException(`Case study with ID "${id}" not found.`);
    }
    return caseStudy;
  }

  async update(
    id: string,
    updateCaseStudyDto: UpdateCaseStudyDto,
  ): Promise<CaseStudy> {
    try {
      SecurityUtil.validateObject(updateCaseStudyDto);
      if (updateCaseStudyDto.slug) {
        const sanitizedSlug = SecurityUtil.sanitizeString(
          updateCaseStudyDto.slug,
        );
        const existingSlug = await this.caseStudyRepository.findOne({
          where: { slug: sanitizedSlug },
        });
        if (existingSlug && existingSlug.id !== id) {
          throw new ConflictException(
            `Case study with slug "${updateCaseStudyDto.slug}" already exists.`,
          );
        }
      }

      const validId = SecurityUtil.validateId(id);
      await this.caseStudyRepository.update(validId, updateCaseStudyDto);
      return this.findOne(id);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      if (error.code === '23503') {
        throw new NotFoundException('Category not found.');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const validId = SecurityUtil.validateId(id);
    const result = await this.caseStudyRepository.delete(validId);
    if (result.affected === 0) {
      throw new NotFoundException(`Case study with ID "${id}" not found.`);
    }
    return { message: 'Case study successfully deleted' };
  }
}
