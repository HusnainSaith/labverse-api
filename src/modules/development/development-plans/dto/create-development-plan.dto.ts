import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDevelopmentPlanDto {
  @ApiProperty({
    description: 'The name of the development plan',
    example: 'Standard Web Package',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'A detailed description of the plan',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
