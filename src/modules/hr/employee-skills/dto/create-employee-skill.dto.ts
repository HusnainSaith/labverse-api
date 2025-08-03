import { IsUUID, IsInt, Min, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeSkillDto {
  @IsUUID()
  employeeId: string;

  @IsUUID()
  skillId: string;

  @IsString()
  @IsOptional()
  proficiencyLevel?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  yearsOfExperience?: number;
}