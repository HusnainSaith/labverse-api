import { Test, TestingModule } from '@nestjs/testing';
import { ProjectMembersService } from '../../../modules/project-member/project-member.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectMember } from '../../../modules/project-member/entities/project-member.entity';
import { Project } from '../../project/entities/projects.entity';
import { EmployeeProfile } from '../../../modules/employees/entities/employee.entity';
import { CreateProjectMemberDto } from '../../../modules/project-member/dto/create-project-member.dto';
import { UpdateProjectMemberDto } from '../../../modules/project-member/dto/update-project-member.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ProjectStatus } from '../../project/dto/project-status.enum';
import { EmployeeStatus } from '../../../modules/employees/dto/employee-status.enum';
import { User } from '../../../modules/users/entities/user.entity';


describe('ProjectMembersService', () => {
  let service: ProjectMembersService;
  let projectMemberRepository: Repository<ProjectMember>;
  let projectRepository: Repository<Project>;
  let employeeProfileRepository: Repository<EmployeeProfile>;
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
    user: mockUser, // Include the mock user object as required
    employeeCode: 'EMP001',
    hireDate: new Date(),
    jobTitle: 'Developer',
    department: 'IT',
    status: EmployeeStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProject: Project = {
    id: 'project-uuid-1',
    name: 'Test Project',
    description: 'A test project description.',
    startDate: new Date(),
    endDate: new Date(),
    status: ProjectStatus.PLANNING, // Corrected to use enum member
    budget: 10000,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProjectMember: ProjectMember = {
    projectId: mockProject.id,
    employeeProfileId: mockEmployeeProfile.id,
    roleOnProject: 'Developer',
    assignedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    project: mockProject,
    employeeProfile: mockEmployeeProfile,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectMembersService,
        {
          provide: getRepositoryToken(ProjectMember),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Project),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(EmployeeProfile),
          useClass: Repository,
        },
        { // Add mock for UserRepository since EmployeeProfileService might interact with it
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProjectMembersService>(ProjectMembersService);
    projectMemberRepository = module.get<Repository<ProjectMember>>(getRepositoryToken(ProjectMember));
    projectRepository = module.get<Repository<Project>>(getRepositoryToken(Project));
    employeeProfileRepository = module.get<Repository<EmployeeProfile>>(getRepositoryToken(EmployeeProfile));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User)); // Initialize userRepository mock

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateProjectMemberDto = {
      projectId: 'project-uuid-2',
      employeeProfileId: 'employee-profile-uuid-2',
      roleOnProject: 'QA',
    };

    it('should successfully create a project member association', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(mockProject);
      jest.spyOn(employeeProfileRepository, 'findOne').mockResolvedValue(mockEmployeeProfile);
      jest.spyOn(projectMemberRepository, 'findOne').mockResolvedValue(undefined); // No existing association
      jest.spyOn(projectMemberRepository, 'create').mockReturnValue({ ...mockProjectMember, ...createDto });
      jest.spyOn(projectMemberRepository, 'save').mockResolvedValue({ ...mockProjectMember, ...createDto });

      const result = await service.create(createDto);
      expect(projectRepository.findOne).toHaveBeenCalledWith({ where: { id: createDto.projectId } });
      expect(employeeProfileRepository.findOne).toHaveBeenCalledWith({ where: { id: createDto.employeeProfileId } });
      expect(projectMemberRepository.findOne).toHaveBeenCalledWith({ where: { projectId: createDto.projectId, employeeProfileId: createDto.employeeProfileId } });
      expect(projectMemberRepository.create).toHaveBeenCalledWith(createDto);
      expect(projectMemberRepository.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining(createDto));
    });

    it('should throw NotFoundException if project does not exist', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(undefined); // Project not found
      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if employee profile does not exist', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(mockProject);
      jest.spyOn(employeeProfileRepository, 'findOne').mockResolvedValue(undefined); // EmployeeProfile not found
      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if association already exists', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(mockProject);
      jest.spyOn(employeeProfileRepository, 'findOne').mockResolvedValue(mockEmployeeProfile);
      jest.spyOn(projectMemberRepository, 'findOne').mockResolvedValue(mockProjectMember); // Association already exists
      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of project member associations with relations', async () => {
      jest.spyOn(projectMemberRepository, 'find').mockResolvedValue([mockProjectMember]);
      const result = await service.findAll();
      expect(projectMemberRepository.find).toHaveBeenCalledWith({ relations: ['project', 'employeeProfile'] });
      expect(result).toEqual([mockProjectMember]);
    });
  });

  describe('findOne', () => {
    it('should return a project member association by IDs', async () => {
      jest.spyOn(projectMemberRepository, 'findOne').mockResolvedValue(mockProjectMember);
      const result = await service.findOne(mockProjectMember.projectId, mockProjectMember.employeeProfileId);
      expect(projectMemberRepository.findOne).toHaveBeenCalledWith({
        where: { projectId: mockProjectMember.projectId, employeeProfileId: mockProjectMember.employeeProfileId },
        relations: ['project', 'employeeProfile'],
      });
      expect(result).toEqual(mockProjectMember);
    });

    it('should throw NotFoundException if association not found', async () => {
      jest.spyOn(projectMemberRepository, 'findOne').mockResolvedValue(undefined);
      await expect(service.findOne('non-existent-project-id', 'non-existent-employee-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateProjectMemberDto = { roleOnProject: 'Team Lead' };

    it('should update a project member association successfully', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProjectMember); // Mock finding existing association
      jest.spyOn(projectMemberRepository, 'save').mockResolvedValue({ ...mockProjectMember, ...updateDto });

      const result = await service.update(mockProjectMember.projectId, mockProjectMember.employeeProfileId, updateDto);
      expect(service.findOne).toHaveBeenCalledWith(mockProjectMember.projectId, mockProjectMember.employeeProfileId);
      expect(projectMemberRepository.save).toHaveBeenCalled();
      expect(result.roleOnProject).toEqual(updateDto.roleOnProject);
    });

    it('should throw NotFoundException if association to update is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException()); // Mock findOne to fail
      await expect(service.update('non-existent-project-id', 'non-existent-employee-id', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a project member association successfully', async () => {
      jest.spyOn(projectMemberRepository, 'delete').mockResolvedValue({ affected: 1, raw: [] });
      await service.remove(mockProjectMember.projectId, mockProjectMember.employeeProfileId);
      expect(projectMemberRepository.delete).toHaveBeenCalledWith({
        projectId: mockProjectMember.projectId,
        employeeProfileId: mockProjectMember.employeeProfileId,
      });
    });

    it('should throw NotFoundException if association to remove is not found', async () => {
      jest.spyOn(projectMemberRepository, 'delete').mockResolvedValue({ affected: 0, raw: [] });
      await expect(service.remove('non-existent-project-id', 'non-existent-employee-id')).rejects.toThrow(NotFoundException);
    });
  });

  // getProjectDetailsWithMembers is commented out in the service, so no test for it here.
});
