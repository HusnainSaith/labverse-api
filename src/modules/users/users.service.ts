import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../roles/entities/role.entity';
import { SecurityUtil } from '../../common/utils/security.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    SecurityUtil.validateObject(dto);
    let role: Role | undefined;
    if (dto.roleId) {
      const validRoleId = SecurityUtil.validateId(dto.roleId);
      role = await this.roleRepository.findOne({ where: { id: validRoleId } });
    }
    const user = this.userRepository.create({
      ...dto,
      role,
    });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['role'] });
  }

  async findOne(id: string): Promise<User> {
    const validId = SecurityUtil.validateId(id);
    const user = await this.userRepository.findOne({
      where: { id: validId },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    SecurityUtil.validateObject(dto);
    const user = await this.findOne(id);

    if (dto.roleId) {
      const validRoleId = SecurityUtil.validateId(dto.roleId);
      const role = await this.roleRepository.findOne({
        where: { id: validRoleId },
      });
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      user.role = role;
    }

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Validates ID and checks existence
    const validId = SecurityUtil.validateId(id);
    await this.userRepository.delete(validId);
  }

  async findByEmail(
    email: string,
    opts: { includePassword?: boolean } = {},
  ): Promise<User | undefined> {
    if (!SecurityUtil.validateEmail(email)) {
      return undefined;
    }
    return this.userRepository.findOne({
      where: { email },
      select: opts.includePassword
        ? ['id', 'email', 'password', 'fullName', 'createdAt', 'updatedAt']
        : undefined,
      relations: ['role'],
    });
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    const validId = SecurityUtil.validateId(id);
    await this.userRepository.update(validId, { password: hashedPassword });
  }
}
