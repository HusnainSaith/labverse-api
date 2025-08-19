import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '../../../src/modules/roles/roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../../../src/modules/roles/entities/role.entity';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { RolePermission } from 'src/modules/role-permissions/entities/role-permission.entity';
import { RoleEnum } from '../../../src/modules/roles/role.enum';
import { ServiceResponse } from '../../../src/common/interfaces/service-response.interface';
import { mockRepository } from '../../utils/test-helpers';

describe('RolesService', () => {
  let service: RolesService;
  let roleRepository: any;  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: getRepositoryToken(Role), useValue: mockRepository() },
        { provide: getRepositoryToken(Permission), useValue: mockRepository() },
        { provide: getRepositoryToken(RolePermission), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    roleRepository = module.get(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new role', async () => {
      const createRoleDto = { name: RoleEnum.ADMIN, description: 'Administrator' };
      const mockRole = { id: 'role-id', ...createRoleDto };

      roleRepository.create.mockReturnValue(mockRole);
      roleRepository.save.mockResolvedValue(mockRole);

      const result = await service.create(createRoleDto);

      expect(result).toEqual({
        success: true,
        message: 'Role created successfully',
        data: mockRole
      });
      expect(roleRepository.create).toHaveBeenCalledWith(createRoleDto);
    });
  });

  describe('findOne', () => {
    it('should return role by id', async () => {
      const mockRole = { id: 'role-id', name: RoleEnum.ADMIN };
      roleRepository.findOne.mockResolvedValue(mockRole);

      const validId = '550e8400-e29b-41d4-a716-446655440000';
      const result = await service.findOne(validId);

      expect(result).toEqual({
        success: true,
        message: 'Role retrieved successfully',
        data: mockRole
      });
      expect(roleRepository.findOne).toHaveBeenCalledWith({ where: { id: validId } });
    });
  });
});
