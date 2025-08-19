import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectTechnologyDto {
  @ApiProperty({
    description: 'UUID of the project',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  projectId: string;

  @ApiProperty({
    description: 'UUID of the technology to be associated with the project',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsUUID()
  technologyId: string;
}
