import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientInteractionDto {
  @ApiProperty({
    description: 'UUID of the client involved in the interaction',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({
    description: 'Type of interaction (e.g., "email", "meeting", "call")',
    example: 'meeting',
  })
  @IsString()
  @IsNotEmpty()
  interactionType: string;

  @ApiProperty({
    description: 'Date of the interaction in ISO 8601 format',
    example: '2025-08-18T10:30:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  interactionDate: string;

  @ApiProperty({
    description: 'UUID of the employee who interacted with the client',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  interactedBy: string;

  @ApiPropertyOptional({
    description: 'Short summary of the interaction',
    example: 'Discussed project requirements and deliverables.',
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the interaction',
    example: 'Client requested weekly status updates via email.',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
