import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from '../../project/projects.controller';
import { ProjectsService } from '../../project/projects.service';
import { CreateProjectDto } from '../../project/dto/create-projects.dto';
import { UpdateProjectDto } from '../../project/dto/update-projects.dto';
// import { Project } from '../../../modules/projects/entities/projects.entity';
import { JwtAuthGuard } from '../../../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { ProjectStatus } from '../../project/dto/project-status.enum';
import { Project } from '../../project/entities/projects.entity';


describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;

  const mockProject: Project = {
    id: 'project-uuid-1',
    name: 'Test Project',
    description: 'A test project description.',
    startDate: new Date('2024-01-01T00:00:00Z'),
    endDate: new Date('2024-12-31T00:00:00Z'),
    status: ProjectStatus.PLANNING,
    budget: 10000.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProjectsService = {
    create: jest.fn((dto: CreateProjectDto) => ({ ...mockProject, ...dto })),
    findAll: jest.fn(() => [mockProject]),
    findOne: jest.fn((id: string) => (id === mockProject.id ? mockProject : null)),
    update: jest.fn((id: string, dto: UpdateProjectDto) => ({ ...mockProject, ...dto, id })),
    remove: jest.fn((id: string) => ({ affected: 1 })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Mock JwtAuthGuard
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard) // Mock RolesGuard
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a project', async () => {
      const createDto: CreateProjectDto = {
        name: 'New Project',
        description: 'Description of new project.',
        startDate: new Date('2025-01-01T00:00:00Z'),
        status: ProjectStatus.PLANNING,
      };
      expect(await controller.create(createDto)).toEqual({
        ...mockProject,
        ...createDto,
      });
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      expect(await controller.findAll()).toEqual([mockProject]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single project', async () => {
      expect(await controller.findOne(mockProject.id)).toEqual(mockProject);
      expect(service.findOne).toHaveBeenCalledWith(mockProject.id);
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const updateDto: UpdateProjectDto = { status: ProjectStatus.COMPLETED };
      expect(await controller.update(mockProject.id, updateDto)).toEqual({
        ...mockProject,
        ...updateDto,
        id: mockProject.id,
      });
      expect(service.update).toHaveBeenCalledWith(mockProject.id, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a project', async () => {
      expect(await controller.remove(mockProject.id)).toEqual({ affected: 1 });
      expect(service.remove).toHaveBeenCalledWith(mockProject.id);
    });
  });
});
