import { IsString, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientApprovalDto {
  @ApiProperty({
    description: 'UUID of the client requesting approval',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4')
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({
    description: 'UUID of the deliverable that needs client approval',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4')
  @IsNotEmpty()
  deliverableId: string;

  @ApiProperty({
    description: 'Details about the approval request',
    example: 'Requesting approval for the final version of the mobile app UI/UX design.',
  })
  @IsString()
  @IsNotEmpty()
  requestDetails: string;
}
