import { IsString, IsUUID, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateTicketDto {
  @IsUUID('4')
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsUUID('4')
  assignedToId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  priority?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;
}
