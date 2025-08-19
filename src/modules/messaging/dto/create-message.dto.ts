import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
}

export class CreateMessageDto {
  @ApiProperty({
    description: 'UUID of the conversation this message belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4')
  conversationId: string;

  @ApiProperty({
    description: 'UUID of the user who is sending the message',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsUUID('4')
  senderId: string;

  @ApiProperty({
    description: 'Content of the message (text content, file path, or image URL)',
    example: 'Hey team, please review the attached document.',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Type of the message',
    enum: MessageType,
    example: MessageType.TEXT,
  })
  @IsOptional()
  @IsEnum(MessageType)
  messageType?: MessageType;
}
