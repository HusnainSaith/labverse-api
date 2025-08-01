import {
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTechnologyDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;
}
