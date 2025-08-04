import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClientPlanQuotationStatus } from '../enums/client-plan-quotation-status.enum';

export class CreateClientPlanQuotationDto {
  @ApiProperty({
    description: 'UUID of the client associated with the quotation',
    example: 'client-uuid-1',
  })
  @IsUUID()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty({
    description:
      'UUID of the development plan (optional, for custom quotations)',
    required: false,
    example: 'plan-uuid-1',
  })
  @IsOptional()
  @IsUUID()
  plan_id?: string;

  @ApiProperty({
    description: 'Current status of the quotation',
    enum: ClientPlanQuotationStatus,
    default: ClientPlanQuotationStatus.DRAFT,
    required: false,
  })
  @IsOptional()
  @IsEnum(ClientPlanQuotationStatus)
  status?: ClientPlanQuotationStatus;

  @ApiProperty({
    description: 'Discount percentage applied to the quotation (0-100)',
    required: false,
    example: 5.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount_percent?: number;

  @ApiProperty({
    description: 'Additional notes for the quotation',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Total amount of the quotation (can be calculated by backend)',
    required: false,
    example: 1250.75,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  total_amount?: number;

  @ApiProperty({
    description: 'UUID of the user who created the quotation (optional)',
    required: false,
    example: 'user-uuid-1',
  })
  @IsOptional()
  @IsUUID()
  created_by?: string;
}
