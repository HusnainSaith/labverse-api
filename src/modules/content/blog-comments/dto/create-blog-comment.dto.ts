import { IsString, IsOptional, IsUUID, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogCommentDto {
  @ApiProperty({
    description: 'ID of the blog post being commented on (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  postId: string;

  @ApiPropertyOptional({
    description:
      'ID of the user making the comment (UUID v4). Used if the commenter is a registered user.',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Name of the guest commenter (if not logged in)',
    example: 'Jane Doe',
  })
  @IsOptional()
  @IsString()
  guestName?: string;

  @ApiPropertyOptional({
    description: 'Email of the guest commenter (if not logged in)',
    example: 'guest@example.com',
  })
  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @ApiProperty({
    description: 'Content of the blog comment',
    example: 'This article really helped me understand NestJS services better!',
  })
  @IsString()
  commentContent: string;

  @ApiPropertyOptional({
    description: 'ID of the parent comment (UUID v4) if this is a reply',
    example: '22222222-2222-2222-2222-222222222222',
  })
  @IsOptional()
  @IsUUID()
  parentCommentId?: string;
}
