import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from '../../../src/modules/permissions/permissions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permission } from '../../../src/modules/roles/entities/permission.entity';
import { mockRepository } from '../../utils/test-helpers';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let permissionRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        { provide: getRepositoryToken(Permission), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    permissionRepository = module.get(getRepositoryToken(Permission));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new permission', async () => {
      const createPermissionDto = {
        name: 'CREATE_USER',
        description: 'Permission to create users',
        resource: 'users',
        action: 'create',
      };
      const mockPermission = { id: 'permission-id', ...createPermissionDto };

      permissionRepository.create.mockReturnValue(mockPermission);
      permissionRepository.save.mockResolvedValue(mockPermission);

      const result = await service.create(createPermissionDto);

      expect(result).toEqual(mockPermission);
      expect(permissionRepository.create).toHaveBeenCalledWith(
        createPermissionDto,
      );
    });
  });
});
