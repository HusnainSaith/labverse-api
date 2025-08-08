import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from '../roles/dto/create-permission.dto';
import { UpdatePermissionDto } from '../roles/dto/update-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RoleEnum } from '../roles/role.enum';
import { SecurityUtil } from '../../common/utils/security.util';

@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  @Permissions('PERMISSIONS_CREATE')
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Get()
  @Permissions('PERMISSIONS_READ')
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get('resources')
  @Permissions('PERMISSIONS_READ')
  getAllResources() {
    return this.permissionsService.getAllResources();
  }

  @Get('actions')
  @Permissions('PERMISSIONS_READ')
  getAllActions() {
    return this.permissionsService.getAllActions();
  }

  @Get('by-resource')
  @Permissions('PERMISSIONS_READ')
  findByResource(@Query('resource') resource: string) {
    return this.permissionsService.findByResource(resource);
  }

  @Get(':id')
  @Permissions('PERMISSIONS_READ')
  findOne(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.permissionsService.findOne(validId);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  @Permissions('PERMISSIONS_UPDATE')
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    const validId = SecurityUtil.validateId(id);
    return this.permissionsService.update(validId, dto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @Permissions('PERMISSIONS_DELETE')
  remove(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.permissionsService.remove(validId);
  }
}
