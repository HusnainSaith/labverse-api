import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EmployeeProfilesService } from '../../../modules/employees/employee.service';
import { EmployeeProfile } from '../../../modules/employees/entities/employee.entity';
import { User } from '../../../modules/users/entities/user.entity';
import { CreateEmployeeProfileDto } from '../../../modules/employees/dto/create-employee.dto';
import { UpdateEmployeeProfileDto } from '../../../modules/employees/dto/update-employee.dto';
import { EmployeeStatus } from '../../../modules/employees/dto/employee-status.enum';

describe('EmployeeProfilesService', () => {
  let service: EmployeeProfilesService;
  let employeeProfileRepository: Repository<EmployeeProfile>;
  let userRepository: Repository<User>;

  const mockUser: User = {
    id: 'user-uuid-1',
    email: 'user@example.com',
    password: 'hashedpassword',
    fullName: 'Test User',
    role: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockEmployeeProfile: EmployeeProfile = {
    id: 'employee-profile-uuid-1',
    userId: mockUser.id,
    employeeCode: 'EMP001',
    hireDate: new Date('2023-01-15'),
    jobTitle: 'Software Engineer',
    department: 'Engineering',
    status: EmployeeStatus.ACTIVE,
    user: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeProfilesService,
        {
          provide: getRepositoryToken(EmployeeProfile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<EmployeeProfilesService>(EmployeeProfilesService);
    employeeProfileRepository = module.get<Repository<EmployeeProfile>>(getRepositoryToken(EmployeeProfile));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateEmployeeProfileDto = {
      userId: 'new-user-uuid',
      employeeCode: 'EMP002',
      jobTitle: 'New Job',
      department: 'New Dept',
      status: EmployeeStatus.ACTIVE,
    };

    it('should successfully create an employee profile', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser); // User exists
      jest.spyOn(employeeProfileRepository, 'findOne').mockResolvedValue(undefined); // No existing profile for user or code
      jest.spyOn(employeeProfileRepository, 'create').mockReturnValue({ ...mockEmployeeProfile, ...createDto });
      jest.spyOn(employeeProfileRepository, 'save').mockResolvedValue({ ...mockEmployeeProfile, ...createDto });

      const result = await service.create(createDto);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: createDto.userId } });
      expect(employeeProfileRepository.findOne).toHaveBeenCalledWith({ where: { userId: createDto.userId } });
      expect(employeeProfileRepository.findOne).toHaveBeenCalledWith({ where: { employeeCode: createDto.employeeCode } });
      expect(employeeProfileRepository.create).toHaveBeenCalledWith(createDto);
      expect(employeeProfileRepository.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining(createDto));
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined); // User does not exist

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: createDto.userId } });
    });

    it('should throw ConflictException if employee profile already exists for user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(employeeProfileRepository, 'findOne')
        .mockResolvedValueOnce(mockEmployeeProfile) // Profile exists for user
        .mockResolvedValueOnce(undefined); // Code is unique (second call)

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(employeeProfileRepository.findOne).toHaveBeenCalledWith({ where: { userId: createDto.userId } });
    });

    it('should throw ConflictException if employee code is not unique', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(employeeProfileRepository, 'findOne')
        .mockResolvedValueOnce(undefined) // No profile for user
        .mockResolvedValueOnce(mockEmployeeProfile); // Code already exists

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(employeeProfileRepository.findOne).toHaveBeenCalledWith({ where: { employeeCode: createDto.employeeCode } });
    });
  });

  describe('findAll', () => {
    it('should return an array of employee profiles with user relation', async () => {
      jest.spyOn(employeeProfileRepository, 'find').mockResolvedValue([mockEmployeeProfile]);
      const result = await service.findAll();
      expect(employeeProfileRepository.find).toHaveBeenCalledWith({ relations: ['user'] });
      expect(result).toEqual([mockEmployeeProfile]);
    });
  });

  describe('findOne', () => {
    it('should return an employee profile by ID with user relation', async () => {
      jest.spyOn(employeeProfileRepository, 'findOne').mockResolvedValue(mockEmployeeProfile);
      const result = await service.findOne(mockEmployeeProfile.id);
      expect(employeeProfileRepository.findOne).toHaveBeenCalledWith({ where: { id: mockEmployeeProfile.id }, relations: ['user'] });
      expect(result).toEqual(mockEmployeeProfile);
    });

    it('should throw NotFoundException if employee profile not found', async () => {
      jest.spyOn(employeeProfileRepository, 'findOne').mockResolvedValue(undefined);
      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateEmployeeProfileDto = { jobTitle: 'Updated Title' };

    it('should update an employee profile successfully', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockEmployeeProfile); // Mock finding existing profile
      jest.spyOn(employeeProfileRepository, 'save').mockResolvedValue({ ...mockEmployeeProfile, ...updateDto });

      const result = await service.update(mockEmployeeProfile.id, updateDto);
      expect(service.findOne).toHaveBeenCalledWith(mockEmployeeProfile.id);
      expect(employeeProfileRepository.save).toHaveBeenCalled();
      expect(result.jobTitle).toEqual(updateDto.jobTitle);
    });

    it('should throw NotFoundException if employee profile to update is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException()); // Mock findOne to fail
      await expect(service.update('non-existent-id', updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if new userId does not exist when changing userId', async () => {
      const updateDtoWithUserChange: UpdateEmployeeProfileDto = { userId: 'new-non-existent-user-id' };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockEmployeeProfile);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined); // New user does not exist

      await expect(service.update(mockEmployeeProfile.id, updateDtoWithUserChange)).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: updateDtoWithUserChange.userId } });
    });

    it('should throw ConflictException if new userId already has an employee profile', async () => {
      const existingProfileForNewUser: EmployeeProfile = {
        ...mockEmployeeProfile,
        id: 'another-employee-profile-uuid',
        userId: 'new-existing-user-id',
      };
      const updateDtoWithUserChange: UpdateEmployeeProfileDto = { userId: 'new-existing-user-id' };
      const newUserMock: User = { ...mockUser, id: 'new-existing-user-id' };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockEmployeeProfile);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(newUserMock);
      jest.spyOn(employeeProfileRepository, 'findOne')
        .mockResolvedValueOnce(existingProfileForNewUser); // New user already has a profile

      await expect(service.update(mockEmployeeProfile.id, updateDtoWithUserChange)).rejects.toThrow(ConflictException);
      expect(employeeProfileRepository.findOne).toHaveBeenCalledWith({ where: { userId: updateDtoWithUserChange.userId } });
    });

    it('should throw ConflictException if new employeeCode is not unique', async () => {
      const existingProfileWithSameCode: EmployeeProfile = {
        ...mockEmployeeProfile,
        id: 'another-employee-profile-uuid',
        employeeCode: 'EMP001', // Same code
      };
      const updateDtoWithCodeChange: UpdateEmployeeProfileDto = { employeeCode: 'EMP001' };

      jest.spyOn(service, 'findOne').mockResolvedValue({ ...mockEmployeeProfile, employeeCode: 'OLD_EMP_CODE' }); // Mock original profile with different code
      jest.spyOn(employeeProfileRepository, 'findOne')
        .mockResolvedValueOnce(existingProfileWithSameCode); // Code already exists

      await expect(service.update(mockEmployeeProfile.id, updateDtoWithCodeChange)).rejects.toThrow(ConflictException);
      expect(employeeProfileRepository.findOne).toHaveBeenCalledWith({ where: { employeeCode: updateDtoWithCodeChange.employeeCode } });
    });
  });

  describe('remove', () => {
    it('should remove an employee profile successfully', async () => {
      jest.spyOn(employeeProfileRepository, 'delete').mockResolvedValue({ affected: 1, raw: [] });
      await service.remove(mockEmployeeProfile.id);
      expect(employeeProfileRepository.delete).toHaveBeenCalledWith(mockEmployeeProfile.id);
    });

    it('should throw NotFoundException if employee profile to remove is not found', async () => {
      jest.spyOn(employeeProfileRepository, 'delete').mockResolvedValue({ affected: 0, raw: [] });
      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
