import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CaseStudiesService } from './case-studies.service';
import { CreateCaseStudyDto } from './dto/create-case-study.dto';
import { UpdateCaseStudyDto } from './dto/update-case-study.dto';

@Controller('case-studies')
export class CaseStudiesController {
  constructor(private readonly caseStudiesService: CaseStudiesService) {}

  @Post()
  create(@Body() createCaseStudyDto: CreateCaseStudyDto) {
    return this.caseStudiesService.create(createCaseStudyDto);
  }

  @Get()
  findAll() {
    return this.caseStudiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.caseStudiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCaseStudyDto: UpdateCaseStudyDto) {
    return this.caseStudiesService.update(id, updateCaseStudyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.caseStudiesService.remove(id);
  }
}