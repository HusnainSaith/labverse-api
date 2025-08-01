import { PartialType } from '@nestjs/swagger';
import { CreateDevelopmentPlanTechnologyDto } from './create-development-plan-technology.dto';

export class UpdateDevelopmentPlanTechnologyDto extends PartialType(CreateDevelopmentPlanTechnologyDto) {}