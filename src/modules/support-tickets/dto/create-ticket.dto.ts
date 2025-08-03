import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @IsUUID('4')
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}