import { IsArray, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PermissionActionEnum } from 'src/common/enums/permission-actions.enum';

export class AssignRolePermissionsDto {
  @ApiProperty({
    description: 'List of permission UUIDs to assign to the role',
    example: [
      '11111111-1111-1111-1111-111111111111',
      '22222222-2222-2222-2222-222222222222',
    ],
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds: string[];

  @ApiPropertyOptional({
    description: 'Action to apply for these permissions',
    enum: PermissionActionEnum,
    example: PermissionActionEnum.CREATE,
  })
  @IsOptional()
  @IsEnum(PermissionActionEnum)
  action?: PermissionActionEnum;
}
