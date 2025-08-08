import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRolePermissionsDto } from './dto/assign-role-permissions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RoleEnum } from './role.enum';
import { SecurityUtil } from '../../common/utils/security.util';

@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  @Permissions('ROLES_CREATE')
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Post(':id/permissions')
  @Roles(RoleEnum.ADMIN)
  @Permissions('ROLES_UPDATE')
  assignPermissions(
    @Param('id') id: string,
    @Body() dto: AssignRolePermissionsDto,
  ) {
    const validId = SecurityUtil.validateId(id);
    return this.rolesService.assignPermissions(validId, dto);
  }

  @Get(':id/permissions')
  @Permissions('ROLES_READ')
  getRolePermissions(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.rolesService.getRolePermissions(validId);
  }

  @Get()
  @Permissions('ROLES_READ')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Permissions('ROLES_READ')
  findOne(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.rolesService.findOne(validId);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  @Permissions('ROLES_UPDATE')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    const validId = SecurityUtil.validateId(id);
    return this.rolesService.update(validId, dto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @Permissions('ROLES_DELETE')
  remove(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.rolesService.remove(validId);
  }
}
