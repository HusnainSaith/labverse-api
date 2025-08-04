import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketReply } from './entities/ticket-reply.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CreateTicketReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';

@Injectable()
export class SupportTicketsService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketReply) private ticketReplyRepository: Repository<TicketReply>,
  ) {}

  /**
   * Creates a new support ticket.
   * @param createTicketDto DTO for creating a ticket.
   * @returns The newly created ticket.
   */
  async createTicket(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const ticket = this.ticketRepository.create(createTicketDto);
    return await this.ticketRepository.save(ticket);
  }

  /**
   * Retrieves all tickets with pagination and filtering.
   * @returns An array of tickets.
   */
  async findAllTickets(): Promise<Ticket[]> {
    return this.ticketRepository.find();
  }

  /**
   * Retrieves all tickets for a specific client.
   * @param clientId The ID of the client.
   * @returns An array of tickets.
   */
  async findTicketsByClient(clientId: string): Promise<Ticket[]> {
    return this.ticketRepository.find({ where: { clientId } });
  }

  /**
   * Finds a single ticket by its ID, including all replies.
   * @param id The ID of the ticket.
   * @returns The ticket with its replies.
   */
  async findTicketById(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['replies'],
      order: {
        replies: {
          createdAt: 'ASC'
        }
      }
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found.`);
    }

    return ticket;
  }

  /**
   * Gets all messages/replies for a ticket in chronological order.
   * @param ticketId The ID of the ticket.
   * @returns Array of ticket replies.
   */
  async getTicketMessages(ticketId: string): Promise<TicketReply[]> {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found.`);
    }

    return this.ticketReplyRepository.find({
      where: { ticketId },
      order: { createdAt: 'ASC' }
    });
  }

  /**
   * Updates a ticket's status, assignment, or priority.
   * @param id The ID of the ticket to update.
   * @param updateTicketDto DTO for updating the ticket.
   * @returns The updated ticket.
   */
  async updateTicket(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findTicketById(id);
    this.ticketRepository.merge(ticket, updateTicketDto);
    return await this.ticketRepository.save(ticket);
  }

  /**
   * Deletes a ticket by its ID.
   * @param id The ID of the ticket to delete.
   */
  async deleteTicket(id: string): Promise<void> {
    const result = await this.ticketRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ticket with ID ${id} not found.`);
    }
  }

  /**
   * Adds a reply to a specific ticket.
   * @param ticketId The ID of the ticket.
   * @param createTicketReplyDto DTO for the reply.
   * @returns The new reply.
   */
  async addReplyToTicket(ticketId: string, createTicketReplyDto: CreateTicketReplyDto): Promise<TicketReply> {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found.`);
    }

    const reply = this.ticketReplyRepository.create({
      ...createTicketReplyDto,
      ticketId,
    });
    return await this.ticketReplyRepository.save(reply);
  }

  /**
   * Updates a ticket reply.
   * @param replyId The ID of the reply to update.
   * @param updateReplyDto DTO for updating the reply.
   * @returns The updated reply.
   */
  async updateReply(replyId: string, updateReplyDto: UpdateReplyDto): Promise<TicketReply> {
    const reply = await this.ticketReplyRepository.findOne({ where: { id: replyId } });
    if (!reply) {
      throw new NotFoundException(`Reply with ID ${replyId} not found.`);
    }

    this.ticketReplyRepository.merge(reply, updateReplyDto);
    return await this.ticketReplyRepository.save(reply);
  }

  /**
   * Marks all unread messages in a ticket as read by a user.
   * @param ticketId The ID of the ticket.
   * @param userId The ID of the user marking as read.
   * @returns Success message with count of marked messages.
   */
  async markTicketAsRead(ticketId: string, userId: string): Promise<{ message: string; markedCount: number }> {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found.`);
    }

    if (!userId) {
      throw new BadRequestException('User ID is required.');
    }

    // Mark all unread replies as read (excluding user's own messages)
    const result = await this.ticketReplyRepository.update(
      { 
        ticketId, 
        isRead: false,
        senderId: { $ne: userId } as any // Not the current user's messages
      },
      { 
        isRead: true, 
        readAt: new Date() 
      }
    );

    return { 
      message: 'Messages marked as read successfully.',
      markedCount: result.affected || 0
    };
  }

  /**
   * Gets unread message count for a ticket.
   * @param ticketId The ID of the ticket.
   * @param userId The ID of the user.
   * @returns Count of unread messages.
   */
  async getUnreadCount(ticketId: string, userId: string): Promise<{ unreadCount: number }> {
    const count = await this.ticketReplyRepository.count({
      where: {
        ticketId,
        isRead: false,
        senderId: { $ne: userId } as any // Not the current user's messages
      }
    });

    return { unreadCount: count };
  }
}