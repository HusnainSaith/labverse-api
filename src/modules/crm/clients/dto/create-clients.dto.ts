import { IsString, IsNotEmpty, IsOptional, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ description: 'The full name of the client', example: 'Acme Corporation' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The email address of the client (must be unique)', required: false, example: 'contact@acmecorp.com' })
  @IsOptional() // Made optional based on your migration's 'isUnique' (which allows null for unique if not set)
  @IsEmail()
  @Length(1, 255)
  email?: string;
}