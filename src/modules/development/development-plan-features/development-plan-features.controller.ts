import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { DevelopmentPlanFeaturesService } from './development-plan-features.service';
import { CreateDevelopmentPlanFeatureDto } from './dto/create-development-plan-feature.dto';
import { UpdateDevelopmentPlanFeatureDto } from './dto/update-development-plan-feature.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('development-plan-features')
@Controller('development-plan-features')
export class DevelopmentPlanFeaturesController {
  constructor(private readonly dpfService: DevelopmentPlanFeaturesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Associate a feature with a development plan' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Association created.', type: CreateDevelopmentPlanFeatureDto })
  async create(@Body() createDpfDto: CreateDevelopmentPlanFeatureDto) {
    return this.dpfService.create(createDpfDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all development plan feature associations' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved all associations.', type: [CreateDevelopmentPlanFeatureDto] })
  async findAll() {
    return this.dpfService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a development plan feature association by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Association found.', type: CreateDevelopmentPlanFeatureDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Association not found.' })
  async findOne(@Param('id') id: string) {
    return this.dpfService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a development plan feature association' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The association has been successfully updated.', type: CreateDevelopmentPlanFeatureDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Association not found.' })
  async update(@Param('id') id: string, @Body() updateDpfDto: UpdateDevelopmentPlanFeatureDto) {
    return this.dpfService.update(id, updateDpfDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a development plan feature association' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The association has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Association not found.' })
  async remove(@Param('id') id: string) {
    await this.dpfService.remove(id);
  }
}