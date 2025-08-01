import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeSkillsService } from '../../../modules/employee-skills/employee-skills.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeSkill } from '../../../modules/employee-skills/entities/employee-skills.entity';
import { EmployeeProfile } from '../../../modules/employees/entities/employee.entity';
import { Skill } from '../../../modules/skills/entities/skills.entity';
import { CreateEmployeeSkillDto } from '../../../modules/employee-skills/dto/employee-skills.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
import {EmployeeStatus} from '../../../modules/employees/dto/employee-status.enum';
import { User } from '../../../modules/users/entities/user.entity';


describe('EmployeeSkillsService', () => {
  let service: EmployeeSkillsService;
  let employeeSkillRepository: Repository<EmployeeSkill>;
  let employeeProfileRepository: Repository<EmployeeProfile>;
  let skillRepository: Repository<Skill>;
  let userRepository: Repository<User>; // Add mock for UserRepository if needed in service tests

  // Mock data for User entity (since EmployeeProfile now links to it)
  const mockUser: User = {
    id: 'user-uuid-1',
    email: 'user@example.com',
    password: 'hashedpassword',
    fullName: 'Test User',
    role: null, // Assuming role is handled elsewhere or can be null for mock
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Mock data for EmployeeProfile entity - UPDATED TO MATCH LATEST SCHEMA
  const mockEmployeeProfile: EmployeeProfile = {
    id: 'employee-profile-uuid-1',
    userId: mockUser.id, // Reference the mock user ID
    user: mockUser, // Include the mock user object
    employeeCode: 'EMP001',
    hireDate: new Date('2023-01-15'),
    jobTitle: 'Developer',
    department: 'IT',
    status: EmployeeStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSkill: Skill = {
    id: 'skill-uuid-1',
    name: 'TypeScript',
    description: 'Superset of JavaScript',
    category: 'Programming Language',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockEmployeeSkill: EmployeeSkill = {
    employeeProfileId: mockEmployeeProfile.id,
    skillId: mockSkill.id,
    proficiencyLevel: 'Expert',
    yearsOfExperience: 5,
    employeeProfile: mockEmployeeProfile,
    skill: mockSkill,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeSkillsService,
        {
          provide: getRepositoryToken(EmployeeSkill),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(EmployeeProfile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Skill),
          useClass: Repository,
        },
        // If EmployeeProfileService uses UserRepository directly, it needs to be mocked here too
        // {
        //   provide: getRepositoryToken(User),
        //   useClass: Repository,
        // },
      ],
    }).compile();

    service = module.get<EmployeeSkillsService>(EmployeeSkillsService);
    employeeSkillRepository = module.get<Repository<EmployeeSkill>>(getRepositoryToken(EmployeeSkill));
    employeeProfileRepository = module.get<Repository<EmployeeProfile>>(getRepositoryToken(EmployeeProfile));
    skillRepository = module.get<Repository<Skill>>(getRepositoryToken(Skill));
    // userRepository = module.get<Repository<User>>(getRepositoryToken(User)); // Uncomment if mocking UserRepository

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateEmployeeSkillDto = {
      employeeProfileId: 'employee-profile-uuid-2',
      skillId: 'skill-uuid-2',
      proficiencyLevel: 'Beginner',
      yearsOfExperience: 1,
    };

    it('should successfully create an employee-skill association', async () => {
      jest.spyOn(employeeProfileRepository, 'findOne').mockResolvedValue(mockEmployeeProfile);
      jest.spyOn(skillRepository, 'findOne').mockResolvedValue(mockSkill);
      jest.spyOn(employeeSkillRepository, 'findOne').mockResolvedValue(undefined); // No existing association
      jest.spyOn(employeeSkillRepository, 'create').mockReturnValue({ ...mockEmployeeSkill, ...createDto });
      jest.spyOn(employeeSkillRepository, 'save').mockResolvedValue({ ...mockEmployeeSkill, ...createDto });

      const result = await service.create(createDto);
      expect(employeeProfileRepository.findOne).toHaveBeenCalledWith({ where: { id: createDto.employeeProfileId } });
      expect(skillRepository.findOne).toHaveBeenCalledWith({ where: { id: createDto.skillId } });
      expect(employeeSkillRepository.findOne).toHaveBeenCalledWith({ where: { employeeProfileId: createDto.employeeProfileId, skillId: createDto.skillId } });
      expect(employeeSkillRepository.create).toHaveBeenCalledWith(createDto);
      expect(employeeSkillRepository.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining(createDto));
    });

    it('should throw NotFoundException if employee profile does not exist', async () => {
      jest.spyOn(employeeProfileRepository, 'findOne').mockResolvedValue(undefined); // EmployeeProfile not found
      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if skill does not exist', async () => {
      jest.spyOn(employeeProfileRepository, 'findOne').mockResolvedValue(mockEmployeeProfile);
      jest.spyOn(skillRepository, 'findOne').mockResolvedValue(undefined); // Skill not found
      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if association already exists', async () => {
      jest.spyOn(employeeProfileRepository, 'findOne').mockResolvedValue(mockEmployeeProfile);
      jest.spyOn(skillRepository, 'findOne').mockResolvedValue(mockSkill);
      jest.spyOn(employeeSkillRepository, 'findOne').mockResolvedValue(mockEmployeeSkill); // Association already exists
      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of employee-skill associations with relations', async () => {
      jest.spyOn(employeeSkillRepository, 'find').mockResolvedValue([mockEmployeeSkill]);
      const result = await service.findAll();
      expect(employeeSkillRepository.find).toHaveBeenCalledWith({ relations: ['employeeProfile', 'skill'] });
      expect(result).toEqual([mockEmployeeSkill]);
    });
  });

  describe('remove', () => {
    it('should remove an employee-skill association successfully', async () => {
      jest.spyOn(employeeSkillRepository, 'delete').mockResolvedValue({ affected: 1, raw: [] });
      await service.remove(mockEmployeeSkill.employeeProfileId, mockEmployeeSkill.skillId);
      expect(employeeSkillRepository.delete).toHaveBeenCalledWith({
        employeeProfileId: mockEmployeeSkill.employeeProfileId,
        skillId: mockEmployeeSkill.skillId,
      });
    });

    it('should throw NotFoundException if association to remove is not found', async () => {
      jest.spyOn(employeeSkillRepository, 'delete').mockResolvedValue({ affected: 0, raw: [] });
      await expect(service.remove('non-existent-emp-id', 'non-existent-skill-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findSkillsByEmployeeId', () => {
    it('should return skills for a given employee ID', async () => {
      jest.spyOn(employeeProfileRepository, 'findOne').mockResolvedValue(mockEmployeeProfile);
      jest.spyOn(employeeSkillRepository, 'find').mockResolvedValue([mockEmployeeSkill]);
      const result = await service.findSkillsByEmployeeId(mockEmployeeProfile.id);
      expect(employeeProfileRepository.findOne).toHaveBeenCalledWith({ where: { id: mockEmployeeProfile.id } });
      expect(employeeSkillRepository.find).toHaveBeenCalledWith({
        where: { employeeProfileId: mockEmployeeProfile.id },
        relations: ['skill'],
      });
      expect(result).toEqual([mockEmployeeSkill]);
    });

    it('should throw NotFoundException if employee profile not found', async () => {
      jest.spyOn(employeeProfileRepository, 'findOne').mockResolvedValue(undefined);
      await expect(service.findSkillsByEmployeeId('non-existent-emp-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findEmployeesBySkillId', () => {
    it('should return employees for a given skill ID', async () => {
      jest.spyOn(skillRepository, 'findOne').mockResolvedValue(mockSkill);
      jest.spyOn(employeeSkillRepository, 'find').mockResolvedValue([mockEmployeeSkill]);
      const result = await service.findEmployeesBySkillId(mockSkill.id);
      expect(skillRepository.findOne).toHaveBeenCalledWith({ where: { id: mockSkill.id } });
      expect(employeeSkillRepository.find).toHaveBeenCalledWith({
        where: { skillId: mockSkill.id },
        relations: ['employeeProfile'],
      });
      expect(result).toEqual([mockEmployeeSkill]);
    });

    it('should throw NotFoundException if skill not found', async () => {
      jest.spyOn(skillRepository, 'findOne').mockResolvedValue(undefined);
      await expect(service.findEmployeesBySkillId('non-existent-skill-id')).rejects.toThrow(NotFoundException);
    });
  });
});
