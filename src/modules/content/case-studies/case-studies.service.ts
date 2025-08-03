import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseStudy } from './entities/case-study.entity';
import { CreateCaseStudyDto } from './dto/create-case-study.dto';
import { UpdateCaseStudyDto } from './dto/update-case-study.dto';

@Injectable()
export class CaseStudiesService {
  constructor(
    @InjectRepository(CaseStudy)
    private caseStudyRepository: Repository<CaseStudy>,
  ) {}

  async create(createCaseStudyDto: CreateCaseStudyDto): Promise<CaseStudy> {
    try {
      const existingSlug = await this.caseStudyRepository.findOne({ 
        where: { slug: createCaseStudyDto.slug } 
      });
      if (existingSlug) {
        throw new ConflictException(`Case study with slug "${createCaseStudyDto.slug}" already exists.`);
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
    const caseStudy = await this.caseStudyRepository.findOne({ 
      where: { id }, 
      relations: ['category'] 
    });
    if (!caseStudy) {
      throw new NotFoundException(`Case study with ID "${id}" not found.`);
    }
    return caseStudy;
  }

  async update(id: string, updateCaseStudyDto: UpdateCaseStudyDto): Promise<CaseStudy> {
    try {
      if (updateCaseStudyDto.slug) {
        const existingSlug = await this.caseStudyRepository.findOne({ 
          where: { slug: updateCaseStudyDto.slug } 
        });
        if (existingSlug && existingSlug.id !== id) {
          throw new ConflictException(`Case study with slug "${updateCaseStudyDto.slug}" already exists.`);
        }
      }

      await this.caseStudyRepository.update(id, updateCaseStudyDto);
      return this.findOne(id);
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '23503') {
        throw new NotFoundException('Category not found.');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.caseStudyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Case study with ID "${id}" not found.`);
    }
    return { message: 'Case study successfully deleted' };
  }
}
