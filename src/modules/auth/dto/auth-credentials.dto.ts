import { IsEmail, IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class AuthCredentialsDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(1, { message: 'Password is required' })
  @MaxLength(255, { message: 'Password cannot exceed 255 characters' })
  password: string;
}
