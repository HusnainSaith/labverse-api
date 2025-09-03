import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClientNotesService } from './client-notes.service';
import { CreateClientNoteDto } from './dto/create-client-note.dto';
import { UpdateClientNoteDto } from './dto/update-client-note.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'

@ApiTags('Client Notes')
@Controller('client-notes')
export class ClientNotesController {
  constructor(private readonly clientNotesService: ClientNotesService) {}

  @Post()
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new client note' })
  create(@Body() createClientNoteDto: CreateClientNoteDto) {
    return this.clientNotesService.create(createClientNoteDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all client notes' })
  findAll() {
    return this.clientNotesService.findAll();
  }

  @Get('client/:clientId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all notes for a specific client' })
  findByClient(@Param('clientId') clientId: string) {
    return this.clientNotesService.findByClient(clientId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a specific client note by ID' })
  findOne(@Param('id') id: string) {
    return this.clientNotesService.findOne(id);
  }
  
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a specific client note by ID' })
  update(
    @Param('id') id: string,
    @Body() updateClientNoteDto: UpdateClientNoteDto,
  ) {
    return this.clientNotesService.update(id, updateClientNoteDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a specific client note by ID' })
  remove(@Param('id') id: string) {
    return this.clientNotesService.remove(id);
  }
}
