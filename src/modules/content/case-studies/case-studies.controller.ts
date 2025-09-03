import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CaseStudiesService } from './case-studies.service';
import { CreateCaseStudyDto } from './dto/create-case-study.dto';
import { UpdateCaseStudyDto } from './dto/update-case-study.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
@ApiTags('Case Studies')
@Controller('case-studies')
export class CaseStudiesController {
  constructor(private readonly caseStudiesService: CaseStudiesService) {}

  @Post()
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new case study' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a new case study',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  create(@Body() createCaseStudyDto: CreateCaseStudyDto) {
    return this.caseStudiesService.create(createCaseStudyDto);
  }

  @Get()
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'get all case studies' })
  findAll() {
    return this.caseStudiesService.findAll();
  }

  @Get(':id')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a specific case study by ID' })
  findOne(@Param('id') id: string) {
    return this.caseStudiesService.findOne(id);
  }

  @Patch(':id')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a specific case study by ID' })
  update(
    @Param('id') id: string,
    @Body() updateCaseStudyDto: UpdateCaseStudyDto,
  ) {
    return this.caseStudiesService.update(id, updateCaseStudyDto);
  }

  @Delete(':id')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a specific case study by ID' })
  remove(@Param('id') id: string) {
    return this.caseStudiesService.remove(id);
  }
}
