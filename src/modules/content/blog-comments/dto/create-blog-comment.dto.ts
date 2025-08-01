import { IsString, IsOptional, IsUUID, IsEmail } from 'class-validator';

export class CreateBlogCommentDto {
  @IsUUID()
  postId: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  guestName?: string;

  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @IsString()
  commentContent: string;

  @IsOptional()
  @IsUUID()
  parentCommentId?: string;
}