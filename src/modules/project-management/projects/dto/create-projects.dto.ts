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
  IsNotEmpty,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ProjectStatus } from './project-status.enum';

export class CreateProjectDto {
  @IsString({ message: 'Project name must be a string' })
  @IsNotEmpty({ message: 'Project name is required' })
  @MinLength(3, { message: 'Project name must be at least 3 characters long' })
  @MaxLength(255, { message: 'Project name cannot exceed 255 characters' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(5000, { message: 'Description cannot exceed 5000 characters' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid ISO date string' })
  startDate?: Date;

  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid ISO date string' })
  endDate?: Date;

  @IsOptional()
  @IsEnum(ProjectStatus, { message: 'Status must be a valid project status' })
  status?: ProjectStatus;

  @IsOptional()
  @IsNumber({}, { message: 'Budget must be a number' })
  @Min(0, { message: 'Budget cannot be negative' })
  @Max(999999999.99, { message: 'Budget cannot exceed 999,999,999.99' })
  budget?: number;

  @IsOptional()
  @IsUUID(4, { message: 'Creator ID must be a valid UUID' })
  creatorId?: string;
}
