import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateClientApprovalDto {
  @IsUUID('4')
  @IsNotEmpty()
  clientId: string;

  @IsUUID('4')
  @IsNotEmpty()
  deliverableId: string;

  @IsString()
  @IsNotEmpty()
  requestDetails: string;
}