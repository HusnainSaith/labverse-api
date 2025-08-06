import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  Length,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({
    description: 'The full name of the client',
    example: 'Acme Corporation',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The email address of the client (must be unique)',
    required: false,
    example: 'contact@acmecorp.com',
  })
  @IsOptional()
  @IsEmail()
  @Length(1, 255)
  email?: string;

  @ApiProperty({
    description: 'The phone number of the client',
    required: false,
    example: '+1-555-123-4567',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'The company name of the client',
    required: false,
    example: 'Acme Corporation',
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  company?: string;

  @ApiProperty({
    description: 'The address of the client',
    required: false,
    example: '123 Main St, City, State 12345',
  })
  @IsOptional()
  @IsString()
  @Length(5, 255)
  address?: string;

  @ApiProperty({
    description: 'The website URL of the client',
    required: false,
    example: 'https://www.acmecorp.com',
  })
  @IsOptional()
  @IsUrl()
  website?: string;
}
