import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTestimonialDto {
  @ApiProperty({
    description: 'Content of the testimonial (the client’s feedback/quote)',
    example:
      'This company transformed our digital presence with a scalable solution!',
  })
  @IsString()
  quoteContent: string;

  @ApiProperty({
    description: 'Name of the person giving the testimonial',
    example: 'John Doe',
  })
  @IsString()
  authorName: string;

  @ApiPropertyOptional({
    description: 'Title and company of the testimonial author',
    example: 'CTO, Acme Corp',
  })
  @IsOptional()
  @IsString()
  authorTitleCompany?: string;

  @ApiPropertyOptional({
    description: 'Avatar/profile image URL of the testimonial author',
    example: 'https://example.com/images/john-doe.png',
  })
  @IsOptional()
  @IsString()
  authorAvatarUrl?: string;

  @ApiPropertyOptional({
    description: 'Approval status of the testimonial',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}
