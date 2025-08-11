import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { AssignRolePermissionsDto } from './dto/assign-role-permissions.dto';

@Controller('role-permissions')
export class RolePermissionsController {
  constructor(private readonly rolePermissionsService: RolePermissionsService) {}

  @Post(':roleId')
  assignPermissions(
    @Param('roleId') roleId: string,
    @Body() dto: AssignRolePermissionsDto,
  ) {
    return this.rolePermissionsService.assignPermissions(roleId, dto);
  }

  @Get(':roleId')
  getPermissions(@Param('roleId') roleId: string) {
    return this.rolePermissionsService.getPermissionsByRole(roleId);
  }

  @Delete(':roleId/:permissionId')
  removePermission(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rolePermissionsService.removePermission(roleId, permissionId);
  }
}
