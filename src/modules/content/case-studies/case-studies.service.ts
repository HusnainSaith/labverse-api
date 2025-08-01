import { Injectable } from '@nestjs/common';
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

  create(createCaseStudyDto: CreateCaseStudyDto) {
    const caseStudy = this.caseStudyRepository.create(createCaseStudyDto);
    return this.caseStudyRepository.save(caseStudy);
  }

  findAll() {
    return this.caseStudyRepository.find({ relations: ['category'] });
  }

  findOne(id: string) {
    return this.caseStudyRepository.findOne({ where: { id }, relations: ['category'] });
  }

  update(id: string, updateCaseStudyDto: UpdateCaseStudyDto) {
    return this.caseStudyRepository.update(id, updateCaseStudyDto);
  }

  remove(id: string) {
    return this.caseStudyRepository.delete(id);
  }
}