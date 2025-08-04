import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanFeatureDto {
  @ApiProperty({
    description: 'The name of the plan feature',
    example: 'Unlimited Revisions',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'A detailed description of the feature',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
