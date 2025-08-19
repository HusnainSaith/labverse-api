import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogPostDto {
  @ApiProperty({
    description: 'Title of the blog post',
    example: 'Getting Started with NestJS and TypeORM',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'SEO-friendly slug for the blog post',
    example: 'getting-started-with-nestjs-and-typeorm',
  })
  @IsString()
  slug: string;

  @ApiProperty({
    description: 'Content of the blog post',
    example: 'NestJS is a progressive Node.js framework for building efficient server-side applications...',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'ID of the author (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @ApiPropertyOptional({
    description: 'ID of the category this post belongs to (UUID v4)',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'URL of the thumbnail image for the blog post',
    example: 'https://example.com/images/nestjs-thumbnail.png',
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    description: 'Publication status of the blog post',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
