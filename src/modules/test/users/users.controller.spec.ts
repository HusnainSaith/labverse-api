import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../users/users.controller';
import { UsersService } from '../../users/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UpdateUserDto } from '../../users/dto/update-user.dto';
import { User } from '../../users/entities/user.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { RoleEnum } from '../../roles/role.enum';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: User = {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    email: 'test@example.com',
    password: 'hashedpassword',
    fullName: 'Test User',
    role: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersService = {
    create: jest.fn((dto: CreateUserDto) => ({ ...mockUser, ...dto })),
    findAll: jest.fn(() => [mockUser]),
    findOne: jest.fn((id: string) => (id === mockUser.id ? mockUser : null)),
    update: jest.fn((id: string, dto: UpdateUserDto) => ({ ...mockUser, ...dto, id })),
    remove: jest.fn((id: string) => ({ affected: 1 })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  // ✅ Your test cases go here (create, findAll, findOne, update, remove)

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'newuser@example.com',
        password: 'newpassword123',
        fullName: 'New User',
        roleId: 'some-role-uuid',
      };
      expect(await controller.create(createUserDto)).toEqual({
        ...mockUser,
        ...createUserDto,
      });
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await controller.findAll()).toEqual([mockUser]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      expect(await controller.findOne(mockUser.id)).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { fullName: 'Updated Name' };
      expect(await controller.update(mockUser.id, updateUserDto)).toEqual({
        ...mockUser,
        ...updateUserDto,
        id: mockUser.id,
      });
      expect(service.update).toHaveBeenCalledWith(mockUser.id, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      expect(await controller.remove(mockUser.id)).toEqual({ affected: 1 });
      expect(service.remove).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
