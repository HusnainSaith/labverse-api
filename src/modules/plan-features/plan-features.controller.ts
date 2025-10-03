import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PlanFeaturesService } from './plan-features.service';
import { CreatePlanFeatureDto } from './dto/create-plan-feature.dto';
import { UpdatePlanFeatureDto } from './dto/update-plan-feature.dto';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('plan-features')
@Controller('plan-features')
export class PlanFeaturesController {
  constructor(private readonly planFeaturesService: PlanFeaturesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new plan feature' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The plan feature has been successfully created.',
    type: CreatePlanFeatureDto,
  })
  async create(@Body() createPlanFeatureDto: CreatePlanFeatureDto) {
    return this.planFeaturesService.create(createPlanFeatureDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all plan features' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved all plan features.',
    type: [CreatePlanFeatureDto],
  })
  async findAll() {
    return this.planFeaturesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve a plan feature by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Plan feature found.',
    type: CreatePlanFeatureDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Plan feature not found.',
  })
  async findOne(@Param('id') id: string) {
    return this.planFeaturesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update an existing plan feature' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The plan feature has been successfully updated.',
    type: CreatePlanFeatureDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Plan feature not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePlanFeatureDto: UpdatePlanFeatureDto,
  ) {
    return this.planFeaturesService.update(id, updatePlanFeatureDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a plan feature' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The plan feature has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Plan feature not found.',
  })
  async remove(@Param('id') id: string) {
    await this.planFeaturesService.remove(id);
  }
}
