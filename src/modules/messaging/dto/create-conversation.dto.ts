import { IsString, IsBoolean, IsUUID, IsOptional, IsArray, ArrayMinSize } from 'class-validator';

export class CreateConversationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsBoolean()
  isGroupChat: boolean;

  @IsArray()
  @ArrayMinSize(2)
  @IsUUID('4', { each: true })
  participantUserIds: string[];
}