import { IsString, IsUUID, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateClientInteractionDto {
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  interactionType: string;

  @IsDateString()
  @IsNotEmpty()
  interactionDate: Date;

  @IsUUID()
  @IsNotEmpty()
  interactedBy: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}