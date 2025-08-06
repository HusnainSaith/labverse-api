import { IsString, IsUUID, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { TicketStatus, TicketPriority } from '../entities/ticket.entity';

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @IsOptional()
  @IsUUID('4')
  assignedTo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;
}
