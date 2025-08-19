import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '../entities/payment.entity';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'ID of the invoice this payment is related to (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  invoiceId: string;

  @ApiProperty({
    description: 'Amount paid for the invoice',
    example: 500.75,
  })
  @IsNumber()
  paymentAmount: number;

  @ApiProperty({
    description: 'Date when the payment was made (ISO 8601 format)',
    example: '2025-08-18T10:30:00Z',
  })
  @IsDateString()
  paymentDate: string;

  @ApiProperty({
    description: 'Payment method used',
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Optional transaction reference or receipt number',
    example: 'TXN-9876543210',
  })
  @IsOptional()
  @IsString()
  transactionReference?: string;
}
