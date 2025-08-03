import {
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  IsDateString,
  IsNumber,
  Min,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { ProjectStatus } from './project-status.enum'; // Assuming you'll create this enum

export class CreateProjectDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @IsOptional()
  @IsUUID()
  creatorId?: string;
}
