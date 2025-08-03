import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateCaseStudyDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  introduction?: string;

  @IsString()
  challenge: string;

  @IsString()
  solution: string;

  @IsString()
  results: string;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}