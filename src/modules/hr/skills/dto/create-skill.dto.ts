import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSkillDto {
  @ApiProperty({
    description: 'Name of the skill',
    example: 'JavaScript',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the skill',
    example:
      'A high-level, versatile programming language primarily used for web development',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Category under which the skill falls',
    example: 'Programming Language',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  category?: string;
}
