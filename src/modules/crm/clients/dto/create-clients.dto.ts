import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  Length,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({
    description: 'The full name of the client',
    example: 'Acme Corporation',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'The email address of the client (must be unique)',
    example: 'contact@acmecorp.com',
  })
  @IsOptional()
  @IsEmail()
  @Length(1, 255)
  email?: string;

  @ApiPropertyOptional({
    description: 'The phone number of the client',
    example: '+1-555-123-4567',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'The company name of the client',
    example: 'Acme Corporation',
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  company?: string;

  @ApiPropertyOptional({
    description: 'The address of the client',
    example: '123 Main St, City, State 12345',
  })
  @IsOptional()
  @IsString()
  @Length(5, 255)
  address?: string;

  @ApiPropertyOptional({
    description: 'The website URL of the client',
    example: 'https://www.acmecorp.com',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    description: 'Profile photo of the client',
    type: 'string',
    format: 'binary',
  })
  profile_photo?: any; // handled separately as file
}
