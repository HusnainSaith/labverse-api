import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketReply } from './entities/ticket-reply.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CreateTicketReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { ValidationUtil } from '../../common/utils/validation.util';
import { SafeLogger } from '../../common/utils/logger.util';

@Injectable()
export class SupportTicketsService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketReply)
    private ticketReplyRepository: Repository<TicketReply>,
  ) {}

  /**
   * Creates a new support ticket.
   * @param createTicketDto DTO for creating a ticket.
   * @returns The newly created ticket.
   */
  async createTicket(
    createTicketDto: CreateTicketDto,
  ): Promise<{ success: boolean; message: string; data: Ticket }> {
    ValidationUtil.validateString(createTicketDto.title, 'title', 3, 200);
    ValidationUtil.validateString(
      createTicketDto.description,
      'description',
      10,
      2000,
    );
    if (createTicketDto.clientId) {
      ValidationUtil.validateUUID(createTicketDto.clientId, 'clientId');
    }
    if (createTicketDto.assignedToId) {
      ValidationUtil.validateUUID(createTicketDto.assignedToId, 'assignedToId');
    }
    if (createTicketDto.priority) {
      ValidationUtil.validateString(
        createTicketDto.priority,
        'priority',
        1,
        20,
      );
    }
    if (createTicketDto.status) {
      ValidationUtil.validateString(createTicketDto.status, 'status', 1, 20);
    }
    if (createTicketDto.category) {
      ValidationUtil.validateString(
        createTicketDto.category,
        'category',
        1,
        50,
      );
    }

    const ticket = this.ticketRepository.create({
      clientId: createTicketDto.clientId,
      title: ValidationUtil.sanitizeString(createTicketDto.title),
      subject: ValidationUtil.sanitizeString(createTicketDto.subject),
      description: ValidationUtil.sanitizeString(createTicketDto.description),
      category: createTicketDto.category
        ? ValidationUtil.sanitizeString(createTicketDto.category)
        : undefined,
      assignedTo: createTicketDto.assignedToId,
      priority: createTicketDto.priority as any,
      status: createTicketDto.status as any,
    });

    const savedTicket = await this.ticketRepository.save(ticket);
    SafeLogger.log(
      `Support ticket created: ${createTicketDto.title}`,
      'SupportTicketsService',
    );

    return {
      success: true,
      message: 'Support ticket created successfully',
      data: savedTicket,
    };
  }

  /**
   * Retrieves all tickets with pagination and filtering.
   * @returns An array of tickets.
   */
  async findAllTickets(): Promise<{
    success: boolean;
    message: string;
    data: Ticket[];
  }> {
    const tickets = await this.ticketRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['replies'],
    });

    return {
      success: true,
      message: 'Support tickets retrieved successfully',
      data: tickets,
    };
  }

  /**
   * Retrieves all tickets for a specific client.
   * @param clientId The ID of the client.
   * @returns An array of tickets.
   */
  async findTicketsByClient(
    clientId: string,
  ): Promise<{ success: boolean; message: string; data: Ticket[] }> {
    ValidationUtil.validateUUID(clientId, 'clientId');

    const tickets = await this.ticketRepository.find({
      where: { clientId },
      order: { createdAt: 'DESC' },
      relations: ['replies'],
    });

    return {
      success: true,
      message: 'Client tickets retrieved successfully',
      data: tickets,
    };
  }

  /**
   * Finds a single ticket by its ID, including all replies.
   * @param id The ID of the ticket.
   * @returns The ticket with its replies.
   */
  async findTicketById(
    id: string,
  ): Promise<{ success: boolean; message: string; data: Ticket }> {
    ValidationUtil.validateUUID(id, 'ticketId');

    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['replies'],
      order: {
        replies: {
          createdAt: 'ASC',
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID "${id}" not found`);
    }

    return {
      success: true,
      message: 'Ticket retrieved successfully',
      data: ticket,
    };
  }

  /**
   * Gets all messages/replies for a ticket in chronological order.
   * @param ticketId The ID of the ticket.
   * @returns Array of ticket replies.
   */
  async getTicketMessages(
    ticketId: string,
  ): Promise<{ success: boolean; message: string; data: TicketReply[] }> {
    ValidationUtil.validateUUID(ticketId, 'ticketId');

    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID "${ticketId}" not found`);
    }

    const replies = await this.ticketReplyRepository.find({
      where: { ticketId },
      order: { createdAt: 'ASC' },
    });

    return {
      success: true,
      message: 'Ticket messages retrieved successfully',
      data: replies,
    };
  }

  /**
   * Updates a ticket's status, assignment, or priority.
   * @param id The ID of the ticket to update.
   * @param updateTicketDto DTO for updating the ticket.
   * @returns The updated ticket.
   */
  async updateTicket(
    id: string,
    updateTicketDto: UpdateTicketDto,
  ): Promise<{ success: boolean; message: string; data: Ticket }> {
    ValidationUtil.validateUUID(id, 'ticketId');

    if (updateTicketDto.title) {
      ValidationUtil.validateString(updateTicketDto.title, 'title', 3, 200);
    }
    if (updateTicketDto.description) {
      ValidationUtil.validateString(
        updateTicketDto.description,
        'description',
        10,
        2000,
      );
    }
    if (updateTicketDto.assignedTo) {
      ValidationUtil.validateUUID(updateTicketDto.assignedTo, 'assignedTo');
    }
    if (updateTicketDto.priority) {
      ValidationUtil.validateString(
        updateTicketDto.priority,
        'priority',
        1,
        20,
      );
    }
    if (updateTicketDto.status) {
      ValidationUtil.validateString(updateTicketDto.status, 'status', 1, 20);
    }
    if (updateTicketDto.category) {
      ValidationUtil.validateString(
        updateTicketDto.category,
        'category',
        1,
        50,
      );
    }

    const ticketResult = await this.findTicketById(id);
    const ticket = ticketResult.data;

    const updateData = {
      ...updateTicketDto,
      ...(updateTicketDto.title && {
        title: ValidationUtil.sanitizeString(updateTicketDto.title),
      }),
      ...(updateTicketDto.description && {
        description: ValidationUtil.sanitizeString(updateTicketDto.description),
      }),
      ...(updateTicketDto.category && {
        category: ValidationUtil.sanitizeString(updateTicketDto.category),
      }),
    };

    this.ticketRepository.merge(ticket, updateData);
    const updatedTicket = await this.ticketRepository.save(ticket);

    SafeLogger.log(`Support ticket updated: ${id}`, 'SupportTicketsService');
    return {
      success: true,
      message: 'Support ticket updated successfully',
      data: updatedTicket,
    };
  }

  /**
   * Deletes a ticket by its ID.
   * @param id The ID of the ticket to delete.
   */
  async deleteTicket(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    ValidationUtil.validateUUID(id, 'ticketId');

    const result = await this.ticketRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ticket with ID "${id}" not found`);
    }

    SafeLogger.log(`Support ticket deleted: ${id}`, 'SupportTicketsService');
    return {
      success: true,
      message: 'Support ticket deleted successfully',
    };
  }

  /**
   * Adds a reply to a specific ticket.
   * @param ticketId The ID of the ticket.
   * @param createTicketReplyDto DTO for the reply.
   * @returns The new reply.
   */
  async addReplyToTicket(
    ticketId: string,
    createTicketReplyDto: CreateTicketReplyDto,
  ): Promise<{ success: boolean; message: string; data: TicketReply }> {
    ValidationUtil.validateUUID(ticketId, 'ticketId');
    ValidationUtil.validateString(
      createTicketReplyDto.message,
      'message',
      1,
      2000,
    );
    if (createTicketReplyDto.senderId) {
      ValidationUtil.validateUUID(createTicketReplyDto.senderId, 'senderId');
    }

    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID "${ticketId}" not found`);
    }

    const reply = this.ticketReplyRepository.create({
      ...createTicketReplyDto,
      message: ValidationUtil.sanitizeString(createTicketReplyDto.message),
      ticketId,
    });

    const savedReply = await this.ticketReplyRepository.save(reply);
    SafeLogger.log(
      `Reply added to ticket: ${ticketId}`,
      'SupportTicketsService',
    );

    return {
      success: true,
      message: 'Reply added successfully',
      data: savedReply,
    };
  }

  /**
   * Updates a ticket reply.
   * @param replyId The ID of the reply to update.
   * @param updateReplyDto DTO for updating the reply.
   * @returns The updated reply.
   */
  async updateReply(
    replyId: string,
    updateReplyDto: UpdateReplyDto,
  ): Promise<{ success: boolean; message: string; data: TicketReply }> {
    ValidationUtil.validateUUID(replyId, 'replyId');

    if (updateReplyDto.message) {
      ValidationUtil.validateString(updateReplyDto.message, 'message', 1, 2000);
    }

    const reply = await this.ticketReplyRepository.findOne({
      where: { id: replyId },
    });
    if (!reply) {
      throw new NotFoundException(`Reply with ID "${replyId}" not found`);
    }

    const updateData = {
      ...updateReplyDto,
      ...(updateReplyDto.message && {
        message: ValidationUtil.sanitizeString(updateReplyDto.message),
      }),
    };

    this.ticketReplyRepository.merge(reply, updateData);
    const updatedReply = await this.ticketReplyRepository.save(reply);

    SafeLogger.log(`Ticket reply updated: ${replyId}`, 'SupportTicketsService');
    return {
      success: true,
      message: 'Reply updated successfully',
      data: updatedReply,
    };
  }

  /**
   * Marks all unread messages in a ticket as read by a user.
   * @param ticketId The ID of the ticket.
   * @param userId The ID of the user marking as read.
   * @returns Success message with count of marked messages.
   */
  async markTicketAsRead(
    ticketId: string,
    userId: string,
  ): Promise<{
    success: boolean;
    message: string;
    data: { markedCount: number };
  }> {
    ValidationUtil.validateUUID(ticketId, 'ticketId');
    ValidationUtil.validateUUID(userId, 'userId');

    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID "${ticketId}" not found`);
    }

    // Mark all unread replies as read (excluding user's own messages)
    const result = await this.ticketReplyRepository.update(
      {
        ticketId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      },
    );

    SafeLogger.log(
      `Ticket marked as read: ${ticketId} by user: ${userId}`,
      'SupportTicketsService',
    );
    return {
      success: true,
      message: 'Messages marked as read successfully',
      data: { markedCount: result.affected || 0 },
    };
  }

  /**
   * Gets unread message count for a ticket.
   * @param ticketId The ID of the ticket.
   * @param userId The ID of the user.
   * @returns Count of unread messages.
   */
  async getUnreadCount(
    ticketId: string,
    userId: string,
  ): Promise<{
    success: boolean;
    message: string;
    data: { unreadCount: number };
  }> {
    ValidationUtil.validateUUID(ticketId, 'ticketId');
    ValidationUtil.validateUUID(userId, 'userId');

    const count = await this.ticketReplyRepository.count({
      where: {
        ticketId,
        isRead: false,
        senderId: { $ne: userId } as any, // Not the current user's messages
      },
    });

    return {
      success: true,
      message: 'Unread count retrieved successfully',
      data: { unreadCount: count },
    };
  }
}
