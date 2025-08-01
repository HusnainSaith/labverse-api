import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateClientNoteDto {
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @IsUUID()
  @IsNotEmpty()
  authorId: string;

  @IsString()
  @IsNotEmpty()
  noteContent: string;
}