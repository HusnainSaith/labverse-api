import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateTicketReplyDto {
  @IsUUID('4')
  @IsNotEmpty()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;
}
