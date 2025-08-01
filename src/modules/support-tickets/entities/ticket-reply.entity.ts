import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity('ticket_replies')
export class TicketReply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ticketId', type: 'uuid' })
  ticketId: string;

  @Column({ name: 'senderId' })
  senderId: string;

  @Column('text')
  content: string;

  @Column({ name: 'isInternal', default: false })
  isInternal: boolean;

  @ManyToOne(() => Ticket, (ticket) => ticket.replies)
  @JoinColumn({ name: 'ticketId' })
  ticket: Ticket;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}