import { IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleEnum } from '../role.enum';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Name of the role',
    enum: RoleEnum,
    example: RoleEnum.ADMIN,
  })
  @IsEnum(RoleEnum)
  name: RoleEnum;

  @ApiPropertyOptional({
    description: 'Optional description of the role',
    example: 'Administrator role with full access',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
