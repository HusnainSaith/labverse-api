import {
  IsString,
  IsBoolean,
  IsUUID,
  IsOptional,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiPropertyOptional({
    description: 'Name of the conversation (only for group chats)',
    example: 'Project Alpha Team',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Indicates whether this is a group chat',
    example: true,
  })
  @IsBoolean()
  isGroupChat: boolean;

  @ApiProperty({
    description: 'List of participant user IDs (minimum 2 users required)',
    example: [
      '11111111-1111-1111-1111-111111111111',
      '22222222-2222-2222-2222-222222222222',
    ],
    isArray: true,
    type: String,
    minItems: 2,
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsUUID('4', { each: true })
  participantUserIds: string[];
}
