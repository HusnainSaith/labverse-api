import { PartialType } from '@nestjs/swagger';
import { CreateDevelopmentPlanFeatureDto } from './create-development-plan-feature.dto';

export class UpdateDevelopmentPlanFeatureDto extends PartialType(
  CreateDevelopmentPlanFeatureDto,
) {}
