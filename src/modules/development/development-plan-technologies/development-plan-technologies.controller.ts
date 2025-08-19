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
import { DevelopmentPlanTechnologiesService } from './development-plan-technologies.service';
import { CreateDevelopmentPlanTechnologyDto } from './dto/create-development-plan-technology.dto';
import { UpdateDevelopmentPlanTechnologyDto } from './dto/update-development-plan-technology.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SecurityUtil } from '../../../common/utils/security.util';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@ApiTags('development-plan-technologies')
@Controller('development-plan-technologies')
export class DevelopmentPlanTechnologiesController {
  constructor(
    private readonly dptService: DevelopmentPlanTechnologiesService,
  ) {}

  @Post()
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Associate a technology with a development plan' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Association created.',
    type: CreateDevelopmentPlanTechnologyDto,
  })
  async create(@Body() createDptDto: CreateDevelopmentPlanTechnologyDto) {
    SecurityUtil.validateObject(createDptDto);
    return this.dptService.create(createDptDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Retrieve all development plan technology associations',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved all associations.',
    type: [CreateDevelopmentPlanTechnologyDto],
  })
  async findAll() {
    return this.dptService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Retrieve a development plan technology association by ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Association found.',
    type: CreateDevelopmentPlanTechnologyDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Association not found.',
  })
  async findOne(@Param('id') id: string) {
    return this.dptService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a development plan technology association' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The association has been successfully updated.',
    type: CreateDevelopmentPlanTechnologyDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Association not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDptDto: UpdateDevelopmentPlanTechnologyDto,
  ) {
    return this.dptService.update(id, updateDptDto);
  }

  @Delete(':id')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a development plan technology association' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The association has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Association not found.',
  })
  async remove(@Param('id') id: string) {
    return this.dptService.remove(id);
  }
}
