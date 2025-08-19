import { IsString, IsOptional, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContactInquiryStatus } from '../entities/contact-inquiry.entity';

export class CreateContactInquiryDto {
  @ApiProperty({
    description: 'Full name of the person making the inquiry',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Email address of the inquirer',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Phone number of the inquirer (optional)',
    example: '+1-202-555-0185',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Subject of the inquiry (optional)',
    example: 'Request for demo',
  })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({
    description: 'Message content of the inquiry',
    example: 'I would like to know more about your SaaS solution pricing.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    description: 'Status of the inquiry',
    enum: ContactInquiryStatus,
    
  })
  @IsOptional()
  @IsEnum(ContactInquiryStatus)
  status?: ContactInquiryStatus;
}
