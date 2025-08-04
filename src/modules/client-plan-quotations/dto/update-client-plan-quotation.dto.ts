import { PartialType } from '@nestjs/swagger';
import { CreateClientPlanQuotationDto } from './create-client-plan-quotation.dto';

export class UpdateClientPlanQuotationDto extends PartialType(
  CreateClientPlanQuotationDto,
) {}
