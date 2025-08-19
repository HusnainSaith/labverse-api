import { IsString, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInvoiceItemDto {
  @ApiProperty({
    description: 'ID of the invoice this item belongs to (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  invoiceId: string;

  @ApiPropertyOptional({
    description: 'ID of the related service (UUID v4)',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @ApiProperty({
    description: 'Description of the invoice item',
    example: 'Website development service (per module)',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Quantity of the service/product',
    example: 5,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Unit price of the service/product',
    example: 150.75,
  })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({
    description: 'Total price (quantity × unit price)',
    example: 753.75,
  })
  @IsNumber()
  totalPrice: number;
}
