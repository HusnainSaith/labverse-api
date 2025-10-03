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
import { DevelopmentPlanServicesService } from './development-plan-services.service';
import { CreateDevelopmentPlanServiceDto } from './dto/create-development-plan-service.dto';
import { UpdateDevelopmentPlanServiceDto } from './dto/update-development-plan-service.dto';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('development-plan-services')
@Controller('development-plan-services')
export class DevelopmentPlanServicesController {
  constructor(private readonly dpsService: DevelopmentPlanServicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Associate a service with a development plan' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Association created.',
    type: CreateDevelopmentPlanServiceDto,
  })
  async create(@Body() createDpsDto: CreateDevelopmentPlanServiceDto) {
    return this.dpsService.create(createDpsDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Retrieve all development plan service associations',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved all associations.',
    type: [CreateDevelopmentPlanServiceDto],
  })
  async findAll() {
    return this.dpsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Retrieve a development plan service association by ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Association found.',
    type: CreateDevelopmentPlanServiceDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Association not found.',
  })
  async findOne(@Param('id') id: string) {
    return this.dpsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a development plan service association' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The association has been successfully updated.',
    type: CreateDevelopmentPlanServiceDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Association not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDpsDto: UpdateDevelopmentPlanServiceDto,
  ) {
    return this.dpsService.update(id, updateDpsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a development plan service association' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The association has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Association not found.',
  })
  async remove(@Param('id') id: string) {
    await this.dpsService.remove(id);
  }
}
