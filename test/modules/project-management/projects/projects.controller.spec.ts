import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from '../../../../src/modules/project-management/projects/projects.controller';
import { ProjectsService } from '../../../../src/modules/project-management/projects/projects.service';
import { ProjectStatus } from '../../../../src/modules/project-management/projects/dto/project-status.enum';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let projectsService: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    projectsService = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a project', async () => {
      const createProjectDto = { name: 'Test Project', clientId: 'client-id' };
      const mockProject = {
        id: 'project-id',
        name: 'Test Project',
        description: null,
        startDate: null,
        endDate: null,
        status: ProjectStatus.PLANNING,
        budget: null,
        creatorId: 'client-id',
        creator: null,
        tasks: [],
        timeEntries: [],
        updates: [],
        milestones: [],
        members: [],
        projectTechnologies: [],
        invoices: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(projectsService, 'create').mockResolvedValue(mockProject);

      const result = await controller.create(createProjectDto);

      expect(result).toEqual(mockProject);
      expect(projectsService.create).toHaveBeenCalledWith(createProjectDto);
    });
  });

  describe('findAll', () => {
    it('should return array of projects', async () => {
      const mockProjects = [
        {
          id: 'project-id',
          name: 'Test Project',
          description: null,
          startDate: null,
          endDate: null,
          status: ProjectStatus.PLANNING,
          budget: null,
          creatorId: 'client-id',
          creator: null,
          tasks: [],
          timeEntries: [],
          updates: [],
          milestones: [],
          members: [],
          projectTechnologies: [],
          invoices: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(projectsService, 'findAll').mockResolvedValue(mockProjects);

      const result = await controller.findAll();

      expect(result).toEqual(mockProjects);
      expect(projectsService.findAll).toHaveBeenCalled();
    });
  });
});
