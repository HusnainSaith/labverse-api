import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateEmployeeSkillDto } from './create-employee-skill.dto';

export class UpdateEmployeeSkillDto extends PartialType(
  OmitType(CreateEmployeeSkillDto, ['employeeId', 'skillId'] as const),
) {}
