import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportTicketsController } from './support-tickets.controller';
import { SupportTicketsService } from './support-tickets.service';
import { Ticket } from './entities/ticket.entity';
import { TicketReply } from './entities/ticket-reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, TicketReply])],
  controllers: [SupportTicketsController],
  providers: [SupportTicketsService],
})
export class SupportTicketsModule {}