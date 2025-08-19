import { IsUUID, IsString, IsOptional, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'UUID of the project this task belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  project_id: string;

  @ApiPropertyOptional({
    description: 'UUID of the milestone associated with this task',
    example: '22222222-2222-2222-2222-222222222222',
  })
  @IsOptional()
  @IsUUID()
  project_milestone_id?: string;

  @ApiProperty({
    description: 'Name of the task',
    example: 'Implement Authentication Module',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the task',
    example: 'Create login, registration, and password reset endpoints',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Current status of the task',
    example: 'in_progress',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Priority of the task',
    example: 'high',
  })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({
    description: 'Due date of the task in ISO format',
    example: '2025-09-30',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  due_date?: Date;

  @ApiProperty({
    description: 'UUID of the employee profile who created the task',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsUUID()
  created_by_employee_profile_id: string;

  @ApiPropertyOptional({
    description: 'UUID of the employee profile assigned to this task',
    example: '33333333-3333-3333-3333-333333333333',
  })
  @IsOptional()
  @IsUUID()
  assigned_to_employee_profile_id?: string;
}
