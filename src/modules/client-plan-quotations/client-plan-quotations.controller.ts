import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ClientPlanQuotationsService } from './client-plan-quotations.service';
import { CreateClientPlanQuotationDto } from './dto/create-client-plan-quotation.dto';
import { UpdateClientPlanQuotationDto } from './dto/update-client-plan-quotation.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('client-plan-quotations')
@Controller('client-plan-quotations')
export class ClientPlanQuotationsController {
  constructor(private readonly quotationsService: ClientPlanQuotationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new client plan quotation' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The quotation has been successfully created.', type: CreateClientPlanQuotationDto })
  async create(@Body() createDto: CreateClientPlanQuotationDto) {
    return this.quotationsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all client plan quotations' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved all quotations.', type: [CreateClientPlanQuotationDto] })
  async findAll() {
    return this.quotationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a client plan quotation by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Quotation found.', type: CreateClientPlanQuotationDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Quotation not found.' })
  async findOne(@Param('id') id: string) {
    return this.quotationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing client plan quotation' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The quotation has been successfully updated.', type: CreateClientPlanQuotationDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Quotation not found.' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateClientPlanQuotationDto) {
    return this.quotationsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a client plan quotation' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The quotation has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Quotation not found.' })
  async remove(@Param('id') id: string) {
    await this.quotationsService.remove(id);
  }
}