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
import { ClientInteractionsService } from './client-interactions.service';
import { CreateClientInteractionDto } from './dto/create-client-interaction.dto';
import { UpdateClientInteractionDto } from './dto/update-client-interaction.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'

@ApiTags('Client Interactions')
@Controller('client-interactions')
export class ClientInteractionsController {
  constructor(
    private readonly clientInteractionsService: ClientInteractionsService,
  ) {}

  @Post()
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new client interaction' })
  create(@Body() createClientInteractionDto: CreateClientInteractionDto) {
    return this.clientInteractionsService.create(createClientInteractionDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all client interactions' })
  findAll() {
    return this.clientInteractionsService.findAll();
  }

  @Get('client/:clientId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all interactions for a specific client' })
  findByClient(@Param('clientId') clientId: string) {
    return this.clientInteractionsService.findByClient(clientId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a specific client interaction by ID' })
  findOne(@Param('id') id: string) {
    return this.clientInteractionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a specific client interaction by ID' })
  update(
    @Param('id') id: string,
    @Body() updateClientInteractionDto: UpdateClientInteractionDto,
  ) {
    return this.clientInteractionsService.update(
      id,
      updateClientInteractionDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a specific client interaction by ID' })
  remove(@Param('id') id: string) {
    return this.clientInteractionsService.remove(id);
  }
}
