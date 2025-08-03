import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { ContactInquiryStatus } from '../entities/contact-inquiry.entity';

export class CreateContactInquiryDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsEnum(ContactInquiryStatus)
  status?: ContactInquiryStatus;
}