import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({
    description: 'The name of the service',
    example: 'Website Design',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the service',
    example: 'Full website design including UI/UX and responsive layout',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The base price of the service',
    example: 500.0,
    minimum: 0,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  base_price: number;

  @ApiPropertyOptional({
    description: 'Expected duration of the service in days',
    example: 30,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration_in_days?: number;

  @ApiPropertyOptional({
    description:
      'Category of the service (e.g., "Web Development", "Consulting")',
    example: 'Web Development',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  category?: string;
}
