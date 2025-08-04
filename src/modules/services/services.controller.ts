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
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The service has been successfully created.',
    type: CreateServiceDto,
  })
  async create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all services' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved all services.',
    type: [CreateServiceDto],
  })
  async findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a service by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Service found.',
    type: CreateServiceDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Service not found.',
  })
  async findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing service' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The service has been successfully updated.',
    type: CreateServiceDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Service not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a service' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The service has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Service not found.',
  })
  async remove(@Param('id') id: string) {
    await this.servicesService.remove(id);
  }
}
