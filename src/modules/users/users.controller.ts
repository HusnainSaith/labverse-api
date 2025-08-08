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
  @Permissions('USERS_CREATE')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Post('with-permissions')
  @Roles(RoleEnum.ADMIN)
  @Permissions('USERS_CREATE')
  createWithPermissions(@Body() dto: CreateUserWithPermissionsDto) {
    return this.usersService.createWithPermissions(dto);
  }

  @Post(':id/permissions')
  @Roles(RoleEnum.ADMIN)
  @Permissions('USERS_UPDATE')
  assignPermissions(
    @Param('id') id: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    const validId = SecurityUtil.validateId(id);
    return this.usersService.assignPermissions(validId, dto);
  }

  @Get(':id/permissions')
  @Permissions('USERS_READ')
  getUserPermissions(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.usersService.getUserPermissions(validId);
  }

  @Get()
  @Permissions('USERS_READ')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Permissions('USERS_READ')
  findOne(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.usersService.findOne(validId);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  @Permissions('USERS_UPDATE')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const validId = SecurityUtil.validateId(id);
    return this.usersService.update(validId, dto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @Permissions('USERS_DELETE')
  remove(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.usersService.remove(validId);
  }
}
