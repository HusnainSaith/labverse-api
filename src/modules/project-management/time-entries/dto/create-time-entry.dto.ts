import {
  IsUUID,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateTimeEntryDto {
  @IsUUID()
  employeeId: string;

  @IsUUID()
  projectId: string;

  @IsOptional()
  @IsUUID()
  taskId?: string;

  @IsNumber()
  @Min(0.1)
  hoursWorked: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  workDate: string;
}
