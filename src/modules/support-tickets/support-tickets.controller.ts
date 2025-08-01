import { Controller, Post, Get, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { SupportTicketsService } from './support-tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CreateTicketReplyDto } from './dto/create-reply.dto';

@Controller('support-tickets')
export class SupportTicketsController {
  constructor(private readonly supportTicketsService: SupportTicketsService) {}

  @Post()
  async createTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.supportTicketsService.createTicket(createTicketDto);
  }

  @Get()
  async findAllTickets() {
    return this.supportTicketsService.findAllTickets();
  }

  @Get('client/:clientId')
  async findTicketsByClient(@Param('clientId') clientId: string) {
    return this.supportTicketsService.findTicketsByClient(clientId);
  }

  @Get(':id')
  async findTicketById(@Param('id') id: string) {
    return this.supportTicketsService.findTicketById(id);
  }

  @Patch(':id')
  async updateTicket(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.supportTicketsService.updateTicket(id, updateTicketDto);
  }

  @Delete(':id')
  async deleteTicket(@Param('id') id: string) {
    await this.supportTicketsService.deleteTicket(id);
    return { message: 'Ticket deleted successfully.' };
  }

  @Post(':ticketId/replies')
  async addReplyToTicket(
    @Param('ticketId') ticketId: string,
    @Body() createTicketReplyDto: CreateTicketReplyDto,
  ) {
    return this.supportTicketsService.addReplyToTicket(ticketId, createTicketReplyDto);
  }
}