import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  quoteContent: string;

  @IsString()
  authorName: string;

  @IsOptional()
  @IsString()
  authorTitleCompany?: string;

  @IsOptional()
  @IsString()
  authorAvatarUrl?: string;

  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}