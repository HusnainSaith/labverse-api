import {
  IsString,
  IsUUID,
  IsOptional,
  IsDateString,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { EmployeeStatus } from './employee-status.enum'; // Assuming you'll create this enum

export class CreateEmployeeProfileDto {
  @IsUUID()
  userId: string;

  @IsString()
  @MaxLength(100)
  employeeCode: string;

  @IsOptional()
  @IsDateString()
  hireDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  jobTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  department?: string;

  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;
}
