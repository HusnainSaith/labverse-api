import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { ApprovalStatus } from '../entities/client-approval.entity';

export class UpdateClientApprovalDto {
  @IsEnum(ApprovalStatus)
  @IsNotEmpty()
  status: ApprovalStatus;

  @IsOptional()
  @IsString()
  responseNotes?: string;
}