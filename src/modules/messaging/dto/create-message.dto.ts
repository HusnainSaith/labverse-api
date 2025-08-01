import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';

export class CreateMessageDto {
  @IsUUID('4')
  conversationId: string;

  @IsUUID('4')
  senderId: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(['text', 'image', 'file'])
  messageType?: string;
}