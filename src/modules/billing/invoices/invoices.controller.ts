import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The invoice has been successfully created.', type: CreateInvoiceDto })
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all invoices' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved all invoices.', type: [CreateInvoiceDto] })
  async findAll() {
    return this.invoicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an invoice by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Invoice found.', type: CreateInvoiceDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Invoice not found.' })
  async findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing invoice' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The invoice has been successfully updated.', type: CreateInvoiceDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Invoice not found.' })
  async update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an invoice' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The invoice has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Invoice not found.' })
  async remove(@Param('id') id: string) {
    await this.invoicesService.remove(id);
  }
}