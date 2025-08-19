import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateInvoiceItemDto } from './create-invoice-item.dto';

export class UpdateInvoiceItemDto extends PartialType(CreateInvoiceItemDto) {
  @ApiPropertyOptional({
    description: 'Updated ID of the invoice this item belongs to (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  invoiceId?: string;

  @ApiPropertyOptional({
    description: 'Updated ID of the related service (UUID v4)',
    example: '11111111-1111-1111-1111-111111111111',
  })
  serviceId?: string;

  @ApiPropertyOptional({
    description: 'Updated description of the invoice item',
    example: 'Website redesign service (per page)',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated quantity of the service/product',
    example: 3,
  })
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Updated unit price of the service/product',
    example: 200.5,
  })
  unitPrice?: number;

  @ApiPropertyOptional({
    description: 'Updated total price (quantity × unit price)',
    example: 601.5,
  })
  totalPrice?: number;
}
