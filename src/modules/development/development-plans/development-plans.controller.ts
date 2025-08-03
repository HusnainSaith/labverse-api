import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { DevelopmentPlansService } from './development-plans.service';
import { CreateDevelopmentPlanDto } from './dto/create-development-plan.dto';
import { UpdateDevelopmentPlanDto } from './dto/update-development-plan.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('development-plans')
@Controller('development-plans')
export class DevelopmentPlansController {
  constructor(private readonly developmentPlansService: DevelopmentPlansService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new development plan' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The development plan has been successfully created.', type: CreateDevelopmentPlanDto })
  async create(@Body() createDevelopmentPlanDto: CreateDevelopmentPlanDto) {
    return this.developmentPlansService.create(createDevelopmentPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all development plans' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved all development plans.', type: [CreateDevelopmentPlanDto] })
  async findAll() {
    return this.developmentPlansService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a development plan by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Development plan found.', type: CreateDevelopmentPlanDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Development plan not found.' })
  async findOne(@Param('id') id: string) {
    return this.developmentPlansService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing development plan' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The development plan has been successfully updated.', type: CreateDevelopmentPlanDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Development plan not found.' })
  async update(@Param('id') id: string, @Body() updateDevelopmentPlanDto: UpdateDevelopmentPlanDto) {
    return this.developmentPlansService.update(id, updateDevelopmentPlanDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a development plan' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The development plan has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Development plan not found.' })
  async remove(@Param('id') id: string) {
    await this.developmentPlansService.remove(id);
  }
}