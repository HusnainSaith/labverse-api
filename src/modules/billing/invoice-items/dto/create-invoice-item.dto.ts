import { IsString, IsOptional, IsUUID, IsNumber } from 'class-validator';

export class CreateInvoiceItemDto {
  @IsUUID()
  invoiceId: string;

  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @IsString()
  description: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  totalPrice: number;
}