import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectTechnologyDto {
  @ApiProperty({
    description: 'The UUID of the new technology to be associated with the project',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsUUID()
  newTechnologyId: string;
}
