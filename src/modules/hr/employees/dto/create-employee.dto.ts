

import {
  IsString,
  IsUUID,
  IsOptional,
  IsDateString,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmployeeStatus } from './employee-status.enum';

export class CreateEmployeeProfileDto {
  @ApiProperty({
    description: 'UUID of the associated user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({
    description: 'Hire date of the employee',
    example: '2025-08-18',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  hireDate?: Date;

  @ApiPropertyOptional({
    description: 'Job title of the employee',
    example: 'Software Engineer',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  jobTitle?: string;

  @ApiPropertyOptional({
    description: 'Department where the employee works',
    example: 'Engineering',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  department?: string;

  @ApiPropertyOptional({
    description: 'Current status of the employee',
    enum: EmployeeStatus,
    example: EmployeeStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  // 👇 Add file only for Swagger validation
  @ApiPropertyOptional({
    description: 'Profile image file',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  file?: any;
}
