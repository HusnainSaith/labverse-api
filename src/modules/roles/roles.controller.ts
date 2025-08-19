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
import { AssignRolePermissionsDto } from '../role-permissions/dto/assign-role-permissions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RoleEnum } from './role.enum';
import { SecurityUtil } from '../../common/utils/security.util';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new role' })
  @Roles(RoleEnum.ADMIN)
  @Permissions('roles.create')
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Post(':id/permissions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Assign permissions to a role' })
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
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve permissions for a role' })
  @Permissions('ROLES_READ')
  getRolePermissions(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.rolesService.getRolePermissions(validId);
  }

  @Get()
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all roles' })
  @Permissions('ROLES_READ')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve a role by ID' })
  @Permissions('ROLES_READ')
  findOne(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.rolesService.findOne(validId);
  }

  @Patch(':id')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a role by ID' })
  @Roles(RoleEnum.ADMIN)
  @Permissions('ROLES_UPDATE')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    const validId = SecurityUtil.validateId(id);
    return this.rolesService.update(validId, dto);
  }

  @Delete(':id')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove a role by ID' })
  @Roles(RoleEnum.ADMIN)
  @Permissions('ROLES_DELETE')
  remove(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.rolesService.remove(validId);
  }
}
