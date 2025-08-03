import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientNotesService } from './client-notes.service';
import { CreateClientNoteDto } from './dto/create-client-note.dto';
import { UpdateClientNoteDto } from './dto/update-client-note.dto';

@Controller('client-notes')
export class ClientNotesController {
  constructor(private readonly clientNotesService: ClientNotesService) {}

  @Post()
  create(@Body() createClientNoteDto: CreateClientNoteDto) {
    return this.clientNotesService.create(createClientNoteDto);
  }

  @Get()
  findAll() {
    return this.clientNotesService.findAll();
  }

  @Get('client/:clientId')
  findByClient(@Param('clientId') clientId: string) {
    return this.clientNotesService.findByClient(clientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientNotesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientNoteDto: UpdateClientNoteDto) {
    return this.clientNotesService.update(id, updateClientNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientNotesService.remove(id);
  }
}