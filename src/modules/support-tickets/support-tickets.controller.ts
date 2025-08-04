import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SupportTicketsService } from './support-tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CreateTicketReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleEnum } from '../roles/role.enum';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';

@UseGuards(JwtAuthGuard, RolesGuard)
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
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPPORT, RoleEnum.CLIENT)
  async findTicketById(@Param('id', UuidValidationPipe) id: string) {
    return this.supportTicketsService.findTicketById(id);
  }

  @Get(':id/messages')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPPORT, RoleEnum.CLIENT)
  async getTicketMessages(@Param('id', UuidValidationPipe) id: string) {
    return this.supportTicketsService.getTicketMessages(id);
  }

  @Patch(':id')
  async updateTicket(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.supportTicketsService.updateTicket(id, updateTicketDto);
  }

  @Delete(':id')
  async deleteTicket(@Param('id') id: string) {
    await this.supportTicketsService.deleteTicket(id);
    return { message: 'Ticket deleted successfully.' };
  }

  @Post(':ticketId/replies')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPPORT, RoleEnum.CLIENT)
  async addReplyToTicket(
    @Param('ticketId', UuidValidationPipe) ticketId: string,
    @Body() createTicketReplyDto: CreateTicketReplyDto,
  ) {
    return this.supportTicketsService.addReplyToTicket(
      ticketId,
      createTicketReplyDto,
    );
  }

  @Patch('replies/:replyId')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPPORT)
  async updateReply(
    @Param('replyId', UuidValidationPipe) replyId: string,
    @Body() updateReplyDto: UpdateReplyDto,
  ) {
    return this.supportTicketsService.updateReply(replyId, updateReplyDto);
  }

  @Patch(':ticketId/mark-read')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPPORT, RoleEnum.CLIENT)
  async markTicketAsRead(
    @Param('ticketId', UuidValidationPipe) ticketId: string,
    @Body('userId') userId: string,
  ) {
    return this.supportTicketsService.markTicketAsRead(ticketId, userId);
  }

  @Get(':ticketId/unread-count')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPPORT, RoleEnum.CLIENT)
  async getUnreadCount(
    @Param('ticketId', UuidValidationPipe) ticketId: string,
    @Query('userId') userId: string,
  ) {
    return this.supportTicketsService.getUnreadCount(ticketId, userId);
  }
}
