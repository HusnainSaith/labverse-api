import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTechnologyDto } from './create-technology.dto';

export class UpdateTechnologyDto extends PartialType(CreateTechnologyDto) {
  @ApiPropertyOptional({
    description: 'Updated name of the technology',
    example: 'Express.js',
    minLength: 3,
    maxLength: 100,
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Updated description of the technology',
    example: 'A fast, unopinionated, minimalist web framework for Node.js.',
    maxLength: 255,
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated category of the technology',
    example: 'Web Framework',
    maxLength: 100,
  })
  category?: string;
}
