import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserWithPermissionsDto } from './dto/create-user-with-permissions.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RoleEnum } from '../roles/role.enum';
import { SecurityUtil } from '../../common/utils/security.util';

@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  @Permissions('users.create')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Post('with-permissions')
  @Roles(RoleEnum.ADMIN)
  @Permissions('users.create')
  createWithPermissions(@Body() dto: CreateUserWithPermissionsDto) {
    return this.usersService.createWithPermissions(dto);
  }

  @Post(':id/permissions')
  @Roles(RoleEnum.ADMIN)
  @Permissions('users.update')
  assignPermissions(
    @Param('id') id: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    const validId = SecurityUtil.validateId(id);
    return this.usersService.assignPermissions(validId, dto);
  }

  @Get(':id/permissions')
  @Permissions('users.read')
  getUserPermissions(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.usersService.getUserPermissions(validId);
  }
  @Get('available-features')
  @Permissions('users.read')
  getAvailableFeatures() {
    return this.usersService.getAvailableFeatures();
  }

  // Get available actions for a specific feature
  @Get('available-features/:feature/actions')
  @Permissions('users.read')
  getAvailableActionsForFeature(@Param('feature') feature: string) {
    return this.usersService.getAvailableActionsForFeature(feature);
  }

  @Get()
  @Permissions('users.read')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Permissions('users.read')
  findOne(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.usersService.findOne(validId);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  @Permissions('users.update')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const validId = SecurityUtil.validateId(id);
    return this.usersService.update(validId, dto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @Permissions('users.delete')
  remove(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.usersService.remove(validId);
  }
}
