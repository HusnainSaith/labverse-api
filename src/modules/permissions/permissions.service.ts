import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../roles/entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { SecurityUtil } from '../../common/utils/security.util';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(dto: CreatePermissionDto): Promise<Permission> {
    SecurityUtil.validateObject(dto);
    const permission = this.permissionRepository.create(dto);
    return this.permissionRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  async findOne(id: string): Promise<Permission> {
    const validId = SecurityUtil.validateId(id);
    const permission = await this.permissionRepository.findOne({
      where: { id: validId },
    });
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async update(id: string, dto: UpdatePermissionDto): Promise<Permission> {
    SecurityUtil.validateObject(dto);
    const validId = SecurityUtil.validateId(id);
    await this.permissionRepository.update(validId, dto);
    return this.findOne(validId);
  }

  async remove(id: string): Promise<void> {
    const validId = SecurityUtil.validateId(id);
    await this.permissionRepository.delete(validId);
  }
}
