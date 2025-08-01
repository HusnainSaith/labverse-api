import { IsString, IsOptional, IsEmail, IsEnum, IsUUID } from 'class-validator';
import { LeadStatus } from '../entities/lead.entity';

export class CreateLeadDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsString()
  contactPersonName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsOptional()
  @IsUUID()
  assignedTo?: string;
}