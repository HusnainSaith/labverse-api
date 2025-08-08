// DTO for assigning permissions to roles
import { IsArray, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PermissionActionEnum } from 'src/common/enums/permission-actions.enum';

export class AssignRolePermissionsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds: string[];

  @IsOptional()
  @IsEnum(PermissionActionEnum)
  action?: PermissionActionEnum;
}
