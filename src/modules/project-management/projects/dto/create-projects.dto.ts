import {
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  IsDateString,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsUUID,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from './project-status.enum';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Name of the project',
    example: 'Website Redesign Project',
    minLength: 3,
    maxLength: 255,
  })
  @IsString({ message: 'Project name must be a string' })
  @IsNotEmpty({ message: 'Project name is required' })
  @MinLength(3, { message: 'Project name must be at least 3 characters long' })
  @MaxLength(255, { message: 'Project name cannot exceed 255 characters' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the project',
    example:
      'This project involves redesigning the corporate website for better UX.',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(5000, { message: 'Description cannot exceed 5000 characters' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiPropertyOptional({
    description: 'Project start date in ISO format',
    example: '2025-09-01',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid ISO date string' })
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Project end date in ISO format',
    example: '2025-12-31',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid ISO date string' })
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Current status of the project',
    enum: ProjectStatus,
    example: ProjectStatus.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(ProjectStatus, { message: 'Status must be a valid project status' })
  status?: ProjectStatus;

  @ApiPropertyOptional({
    description: 'Budget allocated for the project',
    example: 150000,
    minimum: 0,
    maximum: 999999999.99,
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Budget must be a number' })
  @Min(0, { message: 'Budget cannot be negative' })
  @Max(999999999.99, { message: 'Budget cannot exceed 999,999,999.99' })
  budget?: number;

  @ApiPropertyOptional({
    description: 'UUID of the employee who created the project',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsOptional()
  @IsUUID(4, { message: 'Creator ID must be a valid UUID' })
  creatorId?: string;

  @ApiPropertyOptional({
    description: 'Array of image URLs for the project',
    example: [
      'https://fvatmbbtvtixwnnmfbuh.supabase.co/storage/v1/object/public/Labverse/projects/image1.png',
    ],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
