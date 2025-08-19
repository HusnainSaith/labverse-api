import { IsUUID, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateConversationParticipantDto {
  @ApiPropertyOptional({
    description: 'UUID of the last message read by the participant',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4')
  lastReadMessageId?: string;
}
