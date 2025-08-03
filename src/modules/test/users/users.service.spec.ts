import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';
import { RoleEnum } from '../../roles/role.enum';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UpdateUserDto } from '../../users/dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';


describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<Partial<Repository<User>>>;
  let roleRepository: jest.Mocked<Partial<Repository<Role>>>;

  const mockUser: User = {
    id: 'user-uuid-1',
    email: 'test@example.com',
    password: 'hashedpassword',
    fullName: 'Test User',
    role: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRole: Role = {
    id: 'role-uuid-1',
    name: RoleEnum.ADMIN,
    description: 'Admin role',
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUserRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const mockRoleRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    roleRepository = module.get(getRepositoryToken(Role));

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user with role', async () => {
      const dto: CreateUserDto = {
        email: 'new@example.com',
        password: 'securepass',
        fullName: 'New User',
        roleId: mockRole.id,
      };

      const userToSave = { ...dto, role: mockRole };

      roleRepository.findOne.mockResolvedValue(mockRole);
      userRepository.create.mockReturnValue(userToSave as User);
      userRepository.save.mockResolvedValue({ ...mockUser, ...userToSave });

      const result = await service.create(dto);

      expect(roleRepository.findOne).toHaveBeenCalledWith({ where: { id: dto.roleId } });
      expect(userRepository.create).toHaveBeenCalledWith(userToSave);
      expect(userRepository.save).toHaveBeenCalled();
      expect(result.email).toBe(dto.email);
    });

    it('should throw NotFoundException if role not found', async () => {
      const dto: CreateUserDto = {
        email: 'fail@example.com',
        password: 'failpass',
        fullName: 'Fail User',
        roleId: 'non-existent-role-id',
      };

      roleRepository.findOne.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      userRepository.find.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(userRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('user-uuid-1');

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1' },
        relations: ['role'],
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user and change their role', async () => {
      const updatedRole: Role = {
        ...mockRole,
        id: 'role-uuid-2',
        name: RoleEnum.EMPLOYEE,
      };

      const updateUserDto: UpdateUserDto = {
        fullName: 'Updated Name',
        roleId: updatedRole.id,
      };

      userRepository.findOne.mockResolvedValue({ ...mockUser });
      roleRepository.findOne.mockResolvedValue(updatedRole);
      userRepository.save.mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
        role: updatedRole,
      });

      const result = await service.update(mockUser.id, updateUserDto);

      expect(roleRepository.findOne).toHaveBeenCalledWith({ where: { id: updateUserDto.roleId } });
      expect(userRepository.save).toHaveBeenCalled();
      expect(result.fullName).toBe('Updated Name');
      expect(result.role).toEqual(updatedRole);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.update('invalid-id', {})).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if role not found', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      roleRepository.findOne.mockResolvedValue(null);

      const dto: UpdateUserDto = { roleId: 'non-existent-role' };

      await expect(service.update(mockUser.id, dto)).rejects.toThrow(NotFoundException);
    });
  });

describe('remove', () => {
  it('should delete a user', async () => {
    const mockDeleteResult: DeleteResult = {
      affected: 1,
      raw: [],
    };

    userRepository.delete.mockResolvedValue(mockDeleteResult);

    const result = await service.remove('user-uuid-1');

    expect(userRepository.delete).toHaveBeenCalledWith('user-uuid-1');
    expect(result).toEqual(mockDeleteResult);
  });
});

  });

