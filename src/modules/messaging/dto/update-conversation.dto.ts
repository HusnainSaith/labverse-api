import { IsUUID, IsOptional } from 'class-validator';

export class UpdateConversationParticipantDto {
  @IsOptional()
  @IsUUID('4')
  lastReadMessageId?: string;
}