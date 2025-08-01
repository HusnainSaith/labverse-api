import { Test, TestingModule } from '@nestjs/testing';
import { ProjectMembersController } from '../../../modules/project-member/project-member.controller';
import { ProjectMembersService } from '../../../modules/project-member/project-member.service';
import { CreateProjectMemberDto } from '../../../modules/project-member/dto/create-project-member.dto';
import { UpdateProjectMemberDto } from '../../../modules/project-member/dto/update-project-member.dto';
import { ProjectMember } from '../../../modules/project-member/entities/project-member.entity';
import { JwtAuthGuard } from '../../../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

describe('ProjectMembersController', () => {
  let controller: ProjectMembersController;
  let service: ProjectMembersService;

  const mockProjectMember: ProjectMember = {
    projectId: 'project-uuid-1',
    employeeProfileId: 'employee-profile-uuid-1',
    roleOnProject: 'Developer',
    assignedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    project: null, // Mocked in service, not directly used in controller tests
    employeeProfile: null, // Mocked in service, not directly used in controller tests
  };

  const mockProjectMembersService = {
    create: jest.fn((dto: CreateProjectMemberDto) => ({ ...mockProjectMember, ...dto })),
    findAll: jest.fn(() => [mockProjectMember]),
    findOne: jest.fn((projectId: string, employeeProfileId: string) =>
      (projectId === mockProjectMember.projectId && employeeProfileId === mockProjectMember.employeeProfileId
        ? mockProjectMember
        : null)
    ),
    update: jest.fn((projectId: string, employeeProfileId: string, dto: UpdateProjectMemberDto) =>
      ({ ...mockProjectMember, ...dto, projectId, employeeProfileId })
    ),
    remove: jest.fn((projectId: string, employeeProfileId: string) => ({ affected: 1 })),
    // getProjectDetailsWithMembers is commented out in the service, so not mocked here
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectMembersController],
      providers: [
        {
          provide: ProjectMembersService,
          useValue: mockProjectMembersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Mock JwtAuthGuard
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard) // Mock RolesGuard
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProjectMembersController>(ProjectMembersController);
    service = module.get<ProjectMembersService>(ProjectMembersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a project member association', async () => {
      const createDto: CreateProjectMemberDto = {
        projectId: 'project-uuid-2',
        employeeProfileId: 'employee-profile-uuid-2',
        roleOnProject: 'Designer',
      };
      expect(await controller.create(createDto)).toEqual({
        ...mockProjectMember,
        ...createDto,
      });
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of project member associations', async () => {
      expect(await controller.findAll()).toEqual([mockProjectMember]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single project member association', async () => {
      expect(await controller.findOne(mockProjectMember.projectId, mockProjectMember.employeeProfileId)).toEqual(mockProjectMember);
      expect(service.findOne).toHaveBeenCalledWith(mockProjectMember.projectId, mockProjectMember.employeeProfileId);
    });
  });

  describe('update', () => {
    it('should update a project member association', async () => {
      const updateDto: UpdateProjectMemberDto = { roleOnProject: 'Senior Developer' };
      expect(await controller.update(mockProjectMember.projectId, mockProjectMember.employeeProfileId, updateDto)).toEqual({
        ...mockProjectMember,
        ...updateDto,
        projectId: mockProjectMember.projectId,
        employeeProfileId: mockProjectMember.employeeProfileId,
      });
      expect(service.update).toHaveBeenCalledWith(mockProjectMember.projectId, mockProjectMember.employeeProfileId, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a project member association', async () => {
      expect(await controller.remove(mockProjectMember.projectId, mockProjectMember.employeeProfileId)).toEqual({ affected: 1 });
      expect(service.remove).toHaveBeenCalledWith(mockProjectMember.projectId, mockProjectMember.employeeProfileId);
    });
  });
});
