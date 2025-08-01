import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientInteractionsService } from './client-interactions.service';
import { CreateClientInteractionDto } from './dto/create-client-interaction.dto';
import { UpdateClientInteractionDto } from './dto/update-client-interaction.dto';

@Controller('client-interactions')
export class ClientInteractionsController {
  constructor(private readonly clientInteractionsService: ClientInteractionsService) {}

  @Post()
  create(@Body() createClientInteractionDto: CreateClientInteractionDto) {
    return this.clientInteractionsService.create(createClientInteractionDto);
  }

  @Get()
  findAll() {
    return this.clientInteractionsService.findAll();
  }

  @Get('client/:clientId')
  findByClient(@Param('clientId') clientId: string) {
    return this.clientInteractionsService.findByClient(clientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientInteractionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientInteractionDto: UpdateClientInteractionDto) {
    return this.clientInteractionsService.update(id, updateClientInteractionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientInteractionsService.remove(id);
  }
}