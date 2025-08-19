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
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RoleEnum } from '../roles/role.enum';
import { SecurityUtil } from '../../common/utils/security.util';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new permission' })
  @Roles(RoleEnum.ADMIN)
  @Permissions('PERMISSIONS_CREATE')
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Get()
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all permissions' })
  @Permissions('PERMISSIONS_READ')
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get('resources')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all resources' })
  @Permissions('PERMISSIONS_READ')
  getAllResources() {
    return this.permissionsService.getAllResources();
  }

  @Get('actions')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all actions' })
  @Permissions('PERMISSIONS_READ')
  getAllActions() {
    return this.permissionsService.getAllActions();
  }

  @Get('by-resource')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all permissions by resource' })
  @Permissions('PERMISSIONS_READ')
  findByResource(@Query('resource') resource: string) {
    return this.permissionsService.findByResource(resource);
  }

  @Get(':id')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve a specific permission' })
  @Permissions('PERMISSIONS_READ')
  findOne(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.permissionsService.findOne(validId);
  }

  @Patch(':id')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a specific permission' })
  @Roles(RoleEnum.ADMIN)
  @Permissions('PERMISSIONS_UPDATE')
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    const validId = SecurityUtil.validateId(id);
    return this.permissionsService.update(validId, dto);
  }

  @Delete(':id')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a specific permission' })
  @Roles(RoleEnum.ADMIN)
  @Permissions('PERMISSIONS_DELETE')
  remove(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.permissionsService.remove(validId);
  }
}
