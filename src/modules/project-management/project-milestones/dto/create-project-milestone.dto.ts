import { IsUUID, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectMilestoneDto {
  @ApiProperty({
    description: 'UUID of the project this milestone belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  project_id: string;

  @ApiProperty({
    description: 'Name of the milestone',
    example: 'Phase 1 Completion',
    maxLength: 100,
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the milestone',
    example: 'Complete all initial setup tasks and core module development',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Due date for the milestone',
    example: '2025-09-30',
    type: String,
    format: 'date',
  })
  @IsDateString()
  due_date: string;

  @ApiProperty({
    description: 'Current status of the milestone',
    example: 'in_progress',
  })
  @IsString()
  status: string;
}
