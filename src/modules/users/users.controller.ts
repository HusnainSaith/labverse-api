import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  NotFoundException,
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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'create users' })
  @Roles(RoleEnum.ADMIN)
  @Permissions('users.create')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Post('with-permissions')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'create user with permissions' })
  @Roles(RoleEnum.ADMIN)
  @Permissions('users.create')
  createWithPermissions(@Body() dto: CreateUserWithPermissionsDto) {
    return this.usersService.createWithPermissions(dto);
  }

  @Post(':id/permissions')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'assign permissions to user by id' })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'get user permissions by id' })
  @Permissions('users.read')
  getUserPermissions(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.usersService.getUserPermissions(validId);
  }
  @Get('available-features')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'get all features' })
  @Permissions('users.read')
  getAvailableFeatures() {
    return this.usersService.getAvailableFeatures();
  }

  // Get available actions for a specific feature
  @Get('available-features/:feature/actions')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get permidssion of any feature' })
  @Permissions('users.read')
  getAvailableActionsForFeature(@Param('feature') feature: string) {
    return this.usersService.getAvailableActionsForFeature(feature);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get users' })
  @Permissions('users.read')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'get user by id' })
  @Permissions('users.read')
  findOne(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.usersService.findOne(validId);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'update user by id' })
  @Permissions('users.update')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const validId = SecurityUtil.validateId(id);
    return this.usersService.update(validId, dto);
  }

  @Delete(':id')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'delete user by id' })
  @Roles(RoleEnum.ADMIN)
  @Permissions('users.delete')
  remove(@Param('id') id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.usersService.remove(validId);
  }

  //   @Get('profile')
  // @UseGuards(JwtAuthGuard)
  // async getUserProfile(@Request() req: any) {
  //   const userId = req.user?.id;
  //   const user = await this.usersService.findOneWithPermissions(userId);
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  //   return {
  //     success: true,
  //     message: 'User profile retrieved successfully',
  //     data: user,
  //   };
  // }
}
