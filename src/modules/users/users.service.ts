import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { UserPermission } from './entities/user-permission.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserWithPermissionsDto } from './dto/create-user-with-permissions.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  AssignmentActionEnum,
  AssignPermissionsDto,
} from './dto/assign-permissions.dto';
import { SecurityUtil } from '../../common/utils/security.util';
import { ServiceResponse } from '../../common/interfaces/service-response.interface';
import * as bcrypt from 'bcryptjs';
import { PermissionActionEnum } from 'src/common/enums/permission-actions.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(UserPermission)
    private userPermissionRepository: Repository<UserPermission>,
  ) {}

  async create(dto: CreateUserDto): Promise<ServiceResponse<User>> {
    try {
      SecurityUtil.validateObject(dto);

      const existingUser = await this.userRepository.findOne({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new ConflictException(
          'A user with this email address already exists',
        );
      }

      let role: Role | undefined;
      if (dto.roleId) {
        const validRoleId = SecurityUtil.validateId(dto.roleId);
        role = await this.roleRepository.findOne({
          where: { id: validRoleId },
        });
        if (!role) {
          throw new NotFoundException('Specified role not found');
        }
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = this.userRepository.create({
        ...dto,
        password: hashedPassword,
        role,
      });

      const savedUser = await this.userRepository.save(user);
      return {
        success: true,
        message: 'User created successfully',
        data: savedUser as User,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findByEmail(
    email: string,
    options?: { includePassword?: boolean },
  ): Promise<User | null> {
    try {
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .where('user.email = :email', { email: email.toLowerCase().trim() });

      if (options?.includePassword) {
        queryBuilder.addSelect('user.password');
      }

      const user = await queryBuilder.getOne();
      return user || null;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    try {
      const validUserId = SecurityUtil.validateId(userId);

      const result = await this.userRepository.update(
        { id: validUserId },
        { password: hashedPassword },
      );

      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update password: ${error.message}`);
    }
  }

  async createWithPermissions(
    dto: CreateUserWithPermissionsDto,
  ): Promise<ServiceResponse<User>> {
    try {
      SecurityUtil.validateObject(dto);

      const existingUser = await this.userRepository.findOne({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new ConflictException(
          'A user with this email address already exists',
        );
      }

      let role: Role | undefined;
      if (dto.roleId) {
        const validRoleId = SecurityUtil.validateId(dto.roleId);
        role = await this.roleRepository.findOne({
          where: { id: validRoleId },
        });
        if (!role) {
          throw new NotFoundException('Specified role not found');
        }
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = this.userRepository.create({
        email: dto.email,
        password: hashedPassword,
        fullName: dto.fullName,
        role,
      });

      const savedUser = await this.userRepository.save(user);

      // --- FIX: This is the updated logic for saving user permissions ---
      // Instead of looping and calling assignPermissions, we'll create the entities directly.
      if (dto.permissionIds && dto.permissionIds.length > 0) {
        // Fetch all permission entities at once
        const permissions = await this.permissionRepository.findByIds(
          dto.permissionIds,
        );

        if (permissions.length !== dto.permissionIds.length) {
          const foundIds = permissions.map((p) => p.id);
          const missingIds = dto.permissionIds.filter(
            (id) => !foundIds.includes(id),
          );
          throw new BadRequestException(
            `The following permission IDs do not exist: ${missingIds.join(
              ', ',
            )}.`,
          );
        }

        // Create user permission entities
        const userPermissionsToCreate = permissions.map((permission) =>
          this.userPermissionRepository.create({
            user: savedUser,
            permission,
          }),
        );

        // Save all user permissions in a single batch
        await this.userPermissionRepository.save(userPermissionsToCreate);
      }
      // --- END FIX ---

      const userWithRelations = await this.findOneWithPermissions(savedUser.id);
      return {
        success: true,
        message: 'User created with permissions successfully',
        data: userWithRelations,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error(
        `Failed to create user with permissions: ${error.message}`,
      );
    }
  }

  async assignPermissions(
    userId: string,
    dto: AssignPermissionsDto,
  ): Promise<ServiceResponse<User>> {
    try {
      const validUserId = SecurityUtil.validateId(userId);
      SecurityUtil.validateObject(dto);

      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('role.permissions', 'rolePermissions')
        .where('user.id = :id', { id: validUserId })
        .getOne();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const permissionNames = dto.actions.map(
        (action) => `${dto.feature.toLowerCase()}.${action}`,
      );

      const permissions = await this.userRepository.manager.query(
        `SELECT id, name FROM permissions WHERE name = ANY($1)`,
        [permissionNames],
      );

      if (permissions.length !== permissionNames.length) {
        const foundNames = permissions.map((p) => p.name);
        const missingNames = permissionNames.filter(
          (name) => !foundNames.includes(name),
        );
        throw new BadRequestException(
          `The following permissions do not exist: ${missingNames.join(', ')}.`,
        );
      }

      const permissionIds = permissions.map((p) => p.id);

      // --- NEW LOGIC: Check for permissions already granted by the role ---
      // This addresses your request to show a message and prevent saving.
      if (dto.assignmentAction === AssignmentActionEnum.ADD) {
        const rolePermissionNames =
          user.role?.permissions?.map((p) => p.name) || [];
        const redundantPermissions = permissionNames.filter((name) =>
          rolePermissionNames.includes(name),
        );

        if (redundantPermissions.length > 0) {
          throw new BadRequestException(
            `Cannot add permissions ${redundantPermissions.join(', ')} as they are already granted through the user's role: ${user.role.name}.`,
          );
        }
      }
      // --- END NEW LOGIC ---

      switch (dto.assignmentAction) {
        case AssignmentActionEnum.ADD:
          await this.addUserPermissions(validUserId, permissionIds);
          break;
        case AssignmentActionEnum.REMOVE:
          await this.removeUserPermissions(validUserId, permissionIds);
          break;
        case AssignmentActionEnum.REPLACE:
          await this.replaceUserFeaturePermissions(
            validUserId,
            dto.feature,
            permissionIds,
          );
          break;
        default:
          await this.addUserPermissions(validUserId, permissionIds);
      }

      const updatedUser = await this.findOneWithPermissions(validUserId);
      return {
        success: true,
        message: `Permissions for ${dto.feature} ${dto.assignmentAction || 'assigned'} successfully`,
        data: updatedUser,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error(`Failed to assign permissions: ${error.message}`);
    }
  }

  private async addUserPermissions(
    userId: string,
    permissionIds: string[],
  ): Promise<void> {
    for (const permissionId of permissionIds) {
      await this.userRepository.manager.query(
        `INSERT INTO user_permissions (user_id, permission_id, created_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id, permission_id) DO NOTHING`,
        [userId, permissionId],
      );
    }
  }

  private async removeUserPermissions(
    userId: string,
    permissionIds: string[],
  ): Promise<void> {
    if (permissionIds.length === 0) return;

    await this.userRepository.manager.query(
      `DELETE FROM user_permissions
       WHERE user_id = $1 AND permission_id = ANY($2)`,
      [userId, permissionIds],
    );
  }

  private async replaceUserFeaturePermissions(
    userId: string,
    feature: string,
    newPermissionIds: string[],
  ): Promise<void> {
    await this.userRepository.manager.transaction(
      async (transactionManager) => {
        await transactionManager.query(
          `DELETE FROM user_permissions up
           WHERE up.user_id = $1
           AND up.permission_id IN (
             SELECT p.id FROM permissions p
             WHERE p.resource = $2
           )`,
          [userId, feature],
        );

        for (const permissionId of newPermissionIds) {
          await transactionManager.query(
            `INSERT INTO user_permissions (user_id, permission_id, created_at)
             VALUES ($1, $2, NOW())`,
            [userId, permissionId],
          );
        }
      },
    );
  }

  async getAvailableActionsForFeature(feature: string): Promise<string[]> {
    try {
      const actions = await this.userRepository.manager.query(
        `SELECT DISTINCT action FROM permissions WHERE resource = $1 ORDER BY action`,
        [feature],
      );

      return actions.map((row) => row.action);
    } catch (error) {
      throw new Error(
        `Failed to get available actions for feature ${feature}: ${error.message}`,
      );
    }
  }

  async getAvailableFeatures(): Promise<
    ServiceResponse<{ feature: string; actions: string[] }[]>
  > {
    try {
      const features = await this.userRepository.manager.query(`
        SELECT
          resource as feature,
          array_agg(DISTINCT action ORDER BY action) as actions,
          count(*) as permission_count
        FROM permissions
        GROUP BY resource
        ORDER BY resource
      `);

      const result = features.map((row) => ({
        feature: row.feature,
        actions: row.actions,
        permissionCount: parseInt(row.permission_count),
      }));

      return {
        success: true,
        message: 'Available features retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new Error(`Failed to get available features: ${error.message}`);
    }
  }

  async findOneWithPermissions(id: string): Promise<User> {
    const validId = SecurityUtil.validateId(id);

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id = :id', { id: validId })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const allPermissions = await this.userRepository.query(
      `
      SELECT p.*
      FROM permissions p
      INNER JOIN role_permissions rp ON rp.permission_id = p.id
      WHERE rp.role_id = $1
      UNION
      SELECT p.*
      FROM permissions p
      INNER JOIN user_permissions up ON up.permission_id = p.id
      WHERE up.user_id = $2
      ORDER BY resource, action
    `,
      [user.role.id, validId],
    );

    user.permissions = allPermissions;

    if (user.role) {
      delete user.role.permissions;
    }

    return user;
  }

  async findById(id: string): Promise<User | null> {
    try {
      const validId = SecurityUtil.validateId(id);

      const user = await this.userRepository.findOne({
        where: { id: validId },
        relations: ['role'],
      });

      return user || null;
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error.message}`);
    }
  }

  async getUserPermissions(
    userId: string,
  ): Promise<ServiceResponse<Permission[]>> {
    try {
      const validUserId = SecurityUtil.validateId(userId);

      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('role.permissions', 'rolePermissions')
        .where('user.id = :id', { id: validUserId })
        .getOne();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const allPermissions = new Map<string, Permission>();

      if (user.role && user.role.permissions) {
        user.role.permissions.forEach((permission) => {
          allPermissions.set(permission.id, permission);
        });
      }

      const userPermissions = await this.permissionRepository
        .createQueryBuilder('permission')
        .innerJoin('permission.userPermissions', 'up')
        .where('up.userId = :userId', { userId: validUserId })
        .getMany();

      userPermissions.forEach((permission) => {
        allPermissions.set(permission.id, permission);
      });

      const permissions = Array.from(allPermissions.values()).sort((a, b) =>
        `${a.resource}_${a.action}`.localeCompare(`${b.resource}_${b.action}`),
      );

      return {
        success: true,
        message: 'User permissions retrieved successfully',
        data: permissions,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to retrieve user permissions: ${error.message}`);
    }
  }

  async findAll(): Promise<ServiceResponse<User[]>> {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .select([
          'user.id',
          'user.email',
          'user.fullName',
          'user.createdAt',
          'user.updatedAt',
          'role.id',
          'role.name',
        ])
        .orderBy('user.createdAt', 'DESC')
        .getMany();

      return {
        success: true,
        message: 'Users retrieved successfully',
        data: users,
      };
    } catch (error) {
      throw new Error(`Failed to retrieve users: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<ServiceResponse<User>> {
    const user = await this.findOneWithPermissions(id);
    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  async update(id: string, dto: UpdateUserDto): Promise<ServiceResponse<User>> {
    try {
      const validId = SecurityUtil.validateId(id);
      SecurityUtil.validateObject(dto);

      const user = await this.userRepository.findOne({
        where: { id: validId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (dto.email && dto.email !== user.email) {
        const existingUser = await this.userRepository.findOne({
          where: { email: dto.email },
        });
        if (existingUser) {
          throw new ConflictException('Email already exists');
        }
      }

      let role: Role | undefined;
      if (dto.roleId) {
        const validRoleId = SecurityUtil.validateId(dto.roleId);
        role = await this.roleRepository.findOne({
          where: { id: validRoleId },
        });
        if (!role) {
          throw new NotFoundException('Role not found');
        }
      }

      const updateData: any = { ...dto };
      if (dto.password) {
        updateData.password = await bcrypt.hash(dto.password, 10);
      }
      if (role) {
        updateData.role = role;
      }

      await this.userRepository.update(validId, updateData);

      const updatedUser = await this.findOneWithPermissions(validId);
      return {
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async remove(id: string): Promise<ServiceResponse<void>> {
    try {
      const validId = SecurityUtil.validateId(id);

      const user = await this.userRepository.findOne({
        where: { id: validId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.remove(user);
      return {
        success: true,
        message: 'User deleted successfully',
        data: undefined,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}
