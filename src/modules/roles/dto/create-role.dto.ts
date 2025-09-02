// import { IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { RoleEnum } from '../role.enum';

// export class CreateRoleDto {
//   @ApiProperty({
//     description: 'Name of the role',
//     enum: RoleEnum,
//     example: RoleEnum.ADMIN,
//   })
//   @IsEnum(RoleEnum)
//   name: RoleEnum;

//   @ApiPropertyOptional({
//     description: 'Optional description of the role',
//     example: 'Administrator role with full access',
//     maxLength: 255,
//   })
//   @IsOptional()
//   @IsString()
//   @MaxLength(255)
//   description?: string;
// }

import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'The unique name of the role',
    example: 'super_admin',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({
    description: 'A description for the role',
    example: 'Grants full administrative access.',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
