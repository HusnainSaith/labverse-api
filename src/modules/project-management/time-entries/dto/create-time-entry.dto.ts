import {
  IsUUID,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTimeEntryDto {
  @ApiProperty({
    description: 'UUID of the employee who logged the time',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsUUID()
  employeeId: string;

  @ApiProperty({
    description: 'UUID of the project the time entry belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  projectId: string;

  @ApiPropertyOptional({
    description:
      'UUID of the task the time entry is associated with (optional)',
    example: '22222222-2222-2222-2222-222222222222',
  })
  @IsOptional()
  @IsUUID()
  taskId?: string;

  @ApiProperty({
    description: 'Number of hours worked (minimum 0.1)',
    example: 4.5,
    minimum: 0.1,
  })
  @IsNumber()
  @Min(0.1)
  hoursWorked: number;

  @ApiPropertyOptional({
    description: 'Optional description of the work done',
    example: 'Implemented authentication module endpoints',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Date of work in ISO format',
    example: '2025-08-18',
    type: String,
    format: 'date',
  })
  @IsDateString()
  workDate: string;
}
