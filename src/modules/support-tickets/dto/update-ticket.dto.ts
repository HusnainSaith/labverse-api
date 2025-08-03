import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { TicketStatus, TicketPriority } from '../entities/ticket.entity';

export class UpdateTicketDto {
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @IsOptional()
  @IsUUID('4')
  assignedTo?: string;
}