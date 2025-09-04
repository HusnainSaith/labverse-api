
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateEmployeeProfileDto } from './create-employee.dto';

export class UpdateEmployeeProfileDto extends PartialType(CreateEmployeeProfileDto) {
  @ApiPropertyOptional({
    description: 'URL of the employee\'s profile image',
    example: 'https://supabase-bucket.com/employee-profiles/image.png',
    maxLength: 2048,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  profileImage?: string;
}
