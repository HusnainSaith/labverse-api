import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketReply } from './entities/ticket-reply.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CreateTicketReplyDto } from './dto/create-reply.dto';

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
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found.`);
    }

    return ticket;
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
    const ticket = await this.findTicketById(ticketId);
    const reply = this.ticketReplyRepository.create({
      ...createTicketReplyDto,
      ticketId,
    });
    return await this.ticketReplyRepository.save(reply);
  }
}