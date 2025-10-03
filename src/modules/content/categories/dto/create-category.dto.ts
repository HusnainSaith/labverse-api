import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Technology',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description:
      'SEO-friendly slug for the category (lowercase letters, numbers, and hyphens only)',
    example: 'technology-news',
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase with hyphens only',
  })
  slug: string;

  @ApiPropertyOptional({
    description: 'Optional description of the category',
    example: 'Articles and posts related to the latest in technology.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
