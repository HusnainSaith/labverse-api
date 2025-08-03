import { PartialType } from '@nestjs/swagger';
import { CreateDevelopmentPlanServiceDto } from './create-development-plan-service.dto';

export class UpdateDevelopmentPlanServiceDto extends PartialType(CreateDevelopmentPlanServiceDto) {}