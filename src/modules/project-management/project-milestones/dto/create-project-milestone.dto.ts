import { IsUUID, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateProjectMilestoneDto {
  @IsUUID()
  project_id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  due_date: string;

  @IsString()
  status: string;
}
