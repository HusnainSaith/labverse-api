import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsString,
  IsEnum,
  IsDateString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InvoiceStatus } from '../enums/invoice-status.enum';

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'A unique invoice number',
    required: false,
    example: 'INV-2025-001',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  invoice_number?: string;

  @ApiProperty({
    description: 'UUID of the client for this invoice',
    example: 'client-uuid-1',
  })
  @IsUUID()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty({
    description: 'UUID of the related project (optional)',
    required: false,
    example: 'project-uuid-1',
  })
  @IsOptional()
  @IsUUID()
  project_id?: string;

  @ApiProperty({
    description: 'UUID of the related quotation (optional)',
    required: false,
    example: 'quotation-uuid-1',
  })
  @IsOptional()
  @IsUUID()
  quotation_id?: string;

  @ApiProperty({
    description: 'Status of the invoice',
    enum: InvoiceStatus,
    default: InvoiceStatus.UNPAID,
    required: false,
  })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @ApiProperty({
    description: 'Date the invoice was issued (YYYY-MM-DD)',
    example: '2025-07-29',
  })
  @IsDateString()
  @IsNotEmpty()
  issue_date: Date;

  @ApiProperty({
    description: 'Date the invoice is due (YYYY-MM-DD)',
    example: '2025-08-29',
  })
  @IsDateString()
  @IsNotEmpty()
  due_date: Date;

  @ApiProperty({ description: 'Total amount of the invoice', example: 1500.0 })
  @IsNumber()
  @Min(0)
  total_amount: number;

  @ApiProperty({
    description: 'Amount already paid on the invoice',
    required: false,
    example: 500.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  paid_amount?: number;

  @ApiProperty({
    description: 'Description or notes for the invoice',
    required: false,
    example: 'Invoice for web development services',
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;
}
