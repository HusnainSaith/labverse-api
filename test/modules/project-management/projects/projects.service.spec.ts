import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from '../../../../src/modules/project-management/projects/projects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../../../../src/modules/project-management/projects/entities/projects.entity';
import { Client } from '../../../../src/modules/crm/clients/entities/clients.entity';
import { mockRepository } from '../../../utils/test-helpers';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: getRepositoryToken(Project), useValue: mockRepository() },
        { provide: getRepositoryToken(Client), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    projectRepository = module.get(getRepositoryToken(Project));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const createProjectDto = {
        name: 'Test Project',
        description: 'Test Description',
        clientId: 'client-id',
      };
      const mockProject = { id: 'project-id', ...createProjectDto };

      projectRepository.create.mockReturnValue(mockProject);
      projectRepository.save.mockResolvedValue(mockProject);

      const result = await service.create(createProjectDto);

      expect(result).toEqual(mockProject);
      expect(projectRepository.create).toHaveBeenCalledWith(createProjectDto);
    });
  });

  describe('findAll', () => {
    it('should return array of projects', async () => {
      const mockProjects = [{ id: 'project-id', name: 'Test Project' }];
      projectRepository.find.mockResolvedValue(mockProjects);

      const result = await service.findAll();

      expect(result).toEqual(mockProjects);
      expect(projectRepository.find).toHaveBeenCalled();
    });
  });
});
