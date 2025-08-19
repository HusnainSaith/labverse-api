import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCaseStudyDto {
  @ApiProperty({
    description: 'Title of the case study',
    example: 'Scaling an E-commerce Platform with NestJS and PostgreSQL',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'SEO-friendly slug for the case study',
    example: 'scaling-ecommerce-platform-nestjs-postgresql',
  })
  @IsString()
  slug: string;

  @ApiPropertyOptional({
    description: 'Introduction or summary of the case study',
    example: 'This case study highlights how we improved performance and scalability for a leading e-commerce client.',
  })
  @IsOptional()
  @IsString()
  introduction?: string;

  @ApiProperty({
    description: 'Challenges faced by the client',
    example: 'The client struggled with slow checkout processes and database bottlenecks during peak sales.',
  })
  @IsString()
  challenge: string;

  @ApiProperty({
    description: 'Solution implemented to address the challenge',
    example: 'We migrated the system to NestJS with PostgreSQL, optimized queries, and introduced caching.',
  })
  @IsString()
  solution: string;

  @ApiProperty({
    description: 'Results achieved after implementing the solution',
    example: 'Checkout speed improved by 60%, and the platform handled 5x more concurrent users.',
  })
  @IsString()
  results: string;

  @ApiPropertyOptional({
    description: 'Name of the client featured in the case study',
    example: 'Acme Corp',
  })
  @IsOptional()
  @IsString()
  clientName?: string;

  @ApiPropertyOptional({
    description: 'Thumbnail image URL for the case study',
    example: 'https://example.com/images/case-study-thumbnail.png',
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    description: 'Category ID of the case study (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Publication status of the case study',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
