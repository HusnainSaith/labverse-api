import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../roles/entities/role.entity';
import { SafeLogger } from '../../common/utils/logger.util';

// Re-defining for clarity, though it should be in a common file
export interface ServiceResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
}

interface FindOptions {
  includePassword?: boolean;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'fullName' | 'email';
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  //
  // CRUD Operations
  //

  async create(dto: CreateUserDto): Promise<ServiceResponse<User>> {
    try {
      // Input validation is handled by a DTO validation pipe at the controller level.
      // The DTO's @Transform decorators already handle sanitization.

      const existingUser = await this.userRepository.findOne({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new ConflictException('A user with this email address already exists');
      }

      let role: Role | undefined;
      if (dto.roleId) {
        role = await this.roleRepository.findOne({ where: { id: dto.roleId } });
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
      const { password, ...userWithoutPassword } = savedUser;

      SafeLogger.log(`User created successfully: ${dto.email}`, 'UsersService');

      return {
        success: true,
        message: 'User account created successfully',
        data: userWithoutPassword as User,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.handleServiceError(error, 'User creation failed');
    }
  }

  async findAll(options: PaginationOptions = {}): Promise<ServiceResponse<{ users: Omit<User, 'password'>[]; total: number; page: number; totalPages: number }>> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
      } = options;

      const skip = (page - 1) * limit;

      const query = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .skip(skip)
        .take(limit)
        .orderBy(`user.${sortBy}`, sortOrder);

      if (search) {
        const searchTerm = `%${search.trim().toLowerCase()}%`;
        query.andWhere('(LOWER(user.fullName) LIKE :search OR LOWER(user.email) LIKE :search)', { search: searchTerm });
      }

      const [users, total] = await query.getManyAndCount();

      const totalPages = Math.ceil(total / limit);
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);

      SafeLogger.log(`Retrieved ${users.length} users (page ${page}/${totalPages})`, 'UsersService');

      return {
        success: true,
        message: `Successfully retrieved ${users.length} user${users.length !== 1 ? 's' : ''}`,
        data: {
          users: usersWithoutPasswords,
          total,
          page,
          totalPages,
        },
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.handleServiceError(error, 'Failed to retrieve users');
    }
  }

  async findOne(id: string): Promise<ServiceResponse<Omit<User, 'password'>>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['role'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const { password, ...userWithoutPassword } = user;
      return {
        success: true,
        message: 'User information retrieved successfully',
        data: userWithoutPassword,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.handleServiceError(error, `Failed to find user ${id}`);
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<ServiceResponse<Omit<User, 'password'>>> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { id },
        relations: ['role'],
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      if (dto.email && dto.email !== existingUser.email) {
        const emailExists = await this.userRepository.findOne({
          where: { email: dto.email },
        });

        if (emailExists) {
          throw new ConflictException('This email address is already in use by another account');
        }
      }

      let role: Role | undefined = existingUser.role;
      if (dto.roleId !== undefined) {
        if (dto.roleId) {
          role = await this.roleRepository.findOne({ where: { id: dto.roleId } });
          if (!role) {
            throw new NotFoundException('Specified role not found');
          }
        } else {
          role = null;
        }
      }

      Object.assign(existingUser, dto, { role });
      const updatedUser = await this.userRepository.save(existingUser);
      const { password, ...userWithoutPassword } = updatedUser;

      SafeLogger.log(`User updated successfully: ${id}`, 'UsersService');

      return {
        success: true,
        message: 'User information updated successfully',
        data: userWithoutPassword,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.handleServiceError(error, `User update failed for ${id}`);
    }
  }

  async remove(id: string): Promise<ServiceResponse> {
    try {
      const result = await this.userRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }

      SafeLogger.log(`User deleted: ${id}`, 'UsersService');

      return {
        success: true,
        message: 'User account has been deleted successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.handleServiceError(error, `User deletion failed for ${id}`);
    }
  }

  //
  // Utility & Helper Methods
  //

  async findByEmail(email: string, options: FindOptions = {}): Promise<User | undefined> {
    if (!email || typeof email !== 'string') {
      return undefined;
    }

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email: email.toLowerCase().trim() });

    if (options.includePassword) {
      queryBuilder.addSelect('user.password');
    }

    return queryBuilder.getOne();
  }

  async updatePassword(id: string, hashedPassword: string): Promise<ServiceResponse> {
    try {
      const result = await this.userRepository.update({ id }, { password: hashedPassword });
      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }
      SafeLogger.log(`Password updated for user: ${id}`, 'UsersService');
      return { success: true, message: 'Password updated successfully', statusCode: HttpStatus.OK };
    } catch (error) {
      this.handleServiceError(error, `Password update failed for user ${id}`);
    }
  }

  private handleServiceError(error: any, context: string): never {
    SafeLogger.error(`${context}: ${error.message}`, 'UsersService', error.stack);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new InternalServerErrorException(`${context}. Please try again later.`);
  }
}