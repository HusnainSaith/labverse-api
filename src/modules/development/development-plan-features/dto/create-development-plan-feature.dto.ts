import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDevelopmentPlanFeatureDto {
  @ApiProperty({ description: 'The UUID of the development plan', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsUUID()
  @IsNotEmpty()
  plan_id: string;

  @ApiProperty({ description: 'The UUID of the plan feature', example: 'f0e9d8c7-b6a5-4321-fedc-ba9876543210' })
  @IsUUID()
  @IsNotEmpty()
  feature_id: string;
}