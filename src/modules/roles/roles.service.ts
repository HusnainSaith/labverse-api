import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRolePermissionsDto } from './dto/assign-role-permissions.dto';
import { SecurityUtil } from '../../common/utils/security.util';
import { ServiceResponse } from '../../common/interfaces/service-response.interface';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async create(dto: CreateRoleDto): Promise<ServiceResponse<Role>> {
    try {
      SecurityUtil.validateObject(dto);

      const existingRole = await this.roleRepository.findOne({
        where: { name: dto.name },
      });

      if (existingRole) {
        throw new ConflictException('Role with this name already exists');
      }

      const role = this.roleRepository.create(dto);
      const savedRole = await this.roleRepository.save(role);

      return {
        success: true,
        message: 'Role created successfully',
        data: savedRole,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Failed to create role: ${error.message}`);
    }
  }

  async assignPermissions(
    roleId: string,
    dto: AssignRolePermissionsDto,
  ): Promise<ServiceResponse<Role>> {
    try {
      const validRoleId = SecurityUtil.validateId(roleId);
      SecurityUtil.validateObject(dto);

      const role = await this.roleRepository.findOne({
        where: { id: validRoleId },
      });
      if (!role) {
        throw new NotFoundException('Role not found');
      }

      // Validate all permission IDs
      const validPermissionIds = dto.permissionIds.map((id) =>
        SecurityUtil.validateId(id),
      );

      // Remove existing role permissions
      await this.rolePermissionRepository.delete({ roleId: validRoleId });

      // Verify all permissions exist
      const permissions = await this.permissionRepository
        .createQueryBuilder('permission')
        .where('permission.id IN (:...ids)', { ids: validPermissionIds })
        .getMany();

      if (permissions.length !== validPermissionIds.length) {
        throw new NotFoundException('Some permissions not found');
      }

      // Create new role permissions
      const rolePermissions = validPermissionIds.map((permissionId) =>
        this.rolePermissionRepository.create({
          roleId: validRoleId,
          permissionId,
        }),
      );

      await this.rolePermissionRepository.save(rolePermissions);

      const updatedRole = await this.findOneWithPermissions(validRoleId);
      return {
        success: true,
        message: 'Permissions assigned to role successfully',
        data: updatedRole,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to assign permissions to role: ${error.message}`);
    }
  }

  async findOneWithPermissions(id: string): Promise<Role> {
    const validId = SecurityUtil.validateId(id);

    const role = await this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .where('role.id = :id', { id: validId })
      .getOne();

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async getRolePermissions(
    roleId: string,
  ): Promise<ServiceResponse<Permission[]>> {
    try {
      const validRoleId = SecurityUtil.validateId(roleId);

      const role = await this.roleRepository.findOne({
        where: { id: validRoleId },
      });
      if (!role) {
        throw new NotFoundException('Role not found');
      }

      const permissions = await this.permissionRepository
        .createQueryBuilder('permission')
        .innerJoin('permission.rolePermissions', 'rp')
        .where('rp.roleId = :roleId', { roleId: validRoleId })
        .orderBy('permission.resource', 'ASC')
        .addOrderBy('permission.action', 'ASC')
        .getMany();

      return {
        success: true,
        message: 'Role permissions retrieved successfully',
        data: permissions,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to retrieve role permissions: ${error.message}`);
    }
  }

  async findAll(): Promise<ServiceResponse<Role[]>> {
    try {
      const roles = await this.roleRepository.find({
        order: { name: 'ASC' },
      });

      return {
        success: true,
        message: 'Roles retrieved successfully',
        data: roles,
      };
    } catch (error) {
      throw new Error(`Failed to retrieve roles: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<ServiceResponse<Role>> {
    const role = await this.findOneWithPermissions(id);
    return {
      success: true,
      message: 'Role retrieved successfully',
      data: role,
    };
  }

  async update(id: string, dto: UpdateRoleDto): Promise<ServiceResponse<Role>> {
    try {
      const validId = SecurityUtil.validateId(id);
      SecurityUtil.validateObject(dto);

      const role = await this.roleRepository.findOne({
        where: { id: validId },
      });
      if (!role) {
        throw new NotFoundException('Role not found');
      }

      if (dto.name && dto.name !== role.name) {
        const existingRole = await this.roleRepository.findOne({
          where: { name: dto.name },
        });
        if (existingRole) {
          throw new ConflictException('Role name already exists');
        }
      }

      await this.roleRepository.update(validId, dto);

      const updatedRole = await this.findOneWithPermissions(validId);
      return {
        success: true,
        message: 'Role updated successfully',
        data: updatedRole,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(`Failed to update role: ${error.message}`);
    }
  }

  async remove(id: string): Promise<ServiceResponse<void>> {
    try {
      const validId = SecurityUtil.validateId(id);

      const role = await this.roleRepository.findOne({
        where: { id: validId },
        relations: ['users'],
      });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      if (role.users && role.users.length > 0) {
        throw new ConflictException(
          'Cannot delete role that has assigned users',
        );
      }

      await this.roleRepository.remove(role);
      return {
        success: true,
        message: 'Role deleted successfully',
        data: undefined,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(`Failed to delete role: ${error.message}`);
    }
  }
}
