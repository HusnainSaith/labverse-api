import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectTechnologiesDto {
  @ApiProperty({
    description: 'UUID of the project',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  projectId: string;

  @ApiProperty({
    description:
      'Array of UUIDs of technologies to be associated with the project',
    type: [String],
    example: [
      '11111111-1111-1111-1111-111111111111',
      '22222222-2222-2222-2222-222222222222',
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(null, { each: true })
  technologyIds: string[];
}
