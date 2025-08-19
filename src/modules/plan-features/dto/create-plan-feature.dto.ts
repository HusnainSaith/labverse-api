import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlanFeatureDto {
  @ApiProperty({
    description: 'The name of the plan feature',
    example: 'Unlimited Revisions',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the feature',
    example: 'Allows unlimited revisions on all designs within the plan',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
