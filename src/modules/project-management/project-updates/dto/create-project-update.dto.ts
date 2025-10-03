import { IsUUID, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ProjectUpdateType {
  PROGRESS = 'progress',
  MILESTONE = 'milestone',
  ISSUE = 'issue',
  COMPLETION = 'completion',
}

export class CreateProjectUpdateDto {
  @ApiProperty({
    description: 'UUID of the project',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  projectId: string;

  @ApiProperty({
    description: 'Title of the project update',
    example: 'Phase 1 Development Completed',
    maxLength: 100,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the update',
    example:
      'The development of core modules for Phase 1 has been completed successfully.',
    maxLength: 255,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Type of the project update',
    enum: ProjectUpdateType,
    example: ProjectUpdateType.PROGRESS,
  })
  @IsEnum(ProjectUpdateType)
  updateType: ProjectUpdateType;

  @ApiPropertyOptional({
    description: 'UUID of the employee who created this update',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsOptional()
  @IsUUID()
  createdByEmployeeId?: string;
}
