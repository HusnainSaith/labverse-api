import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-clients.dto';
import { UpdateClientDto } from './dto/update-clients.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The client has been successfully created.', type: CreateClientDto })
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all clients' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved all clients.', type: [CreateClientDto] })
  async findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a client by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Client found.', type: CreateClientDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Client not found.' })
  async findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing client' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The client has been successfully updated.', type: CreateClientDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Client not found.' })
  async update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a client' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The client has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Client not found.' })
  async remove(@Param('id') id: string) {
    await this.clientsService.remove(id);
  }
}