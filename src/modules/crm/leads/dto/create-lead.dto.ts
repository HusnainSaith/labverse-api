import { IsString, IsOptional, IsEmail, IsEnum, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeadStatus } from '../entities/lead.entity';

export class CreateLeadDto {
  @ApiPropertyOptional({
    description: 'Name of the company (optional)',
    example: 'Acme Corporation',
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({
    description: 'Full name of the contact person',
    example: 'Jane Smith',
  })
  @IsString()
  @IsNotEmpty()
  contactPersonName: string;

  @ApiProperty({
    description: 'Email address of the lead',
    example: 'jane.smith@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    description: 'Phone number of the lead (optional)',
    example: '+1-202-555-0147',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the lead (optional)',
    example: 'Interested in enterprise-level SaaS solutions.',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Current status of the lead',
    enum: LeadStatus,
    example: LeadStatus.NEW,
  })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiPropertyOptional({
    description: 'User ID of the employee this lead is assigned to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  assignedTo?: string;
}
