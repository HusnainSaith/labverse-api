import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from '../../project/projects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../project/entities/projects.entity';
import { CreateProjectDto } from '../../project/dto/create-projects.dto';
import { UpdateProjectDto} from '../../project/dto/update-projects.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ProjectStatus } from '../../project/dto/project-status.enum';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectRepository: Repository<Project>;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    projectRepository = module.get<Repository<Project>>(getRepositoryToken(Project));

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateProjectDto = {
      name: 'New Project',
      description: 'Description of new project.',
      startDate: new Date('2025-01-01T00:00:00Z'),
      status: ProjectStatus.PLANNING,
    };

    it('should successfully create a project', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(undefined); // No existing project with same name
      jest.spyOn(projectRepository, 'create').mockReturnValue({ ...mockProject, ...createDto });
      jest.spyOn(projectRepository, 'save').mockResolvedValue({ ...mockProject, ...createDto });

      const result = await service.create(createDto);
      expect(projectRepository.findOne).toHaveBeenCalledWith({ where: { name: createDto.name } });
      expect(projectRepository.create).toHaveBeenCalledWith(createDto);
      expect(projectRepository.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining(createDto));
    });

    it('should throw ConflictException if project name already exists', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(mockProject); // Project with same name exists

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(projectRepository.findOne).toHaveBeenCalledWith({ where: { name: createDto.name } });
    });
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      jest.spyOn(projectRepository, 'find').mockResolvedValue([mockProject]);
      const result = await service.findAll();
      expect(projectRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual([mockProject]);
    });
  });

  describe('findOne', () => {
    it('should return a project by ID', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(mockProject);
      const result = await service.findOne(mockProject.id);
      expect(projectRepository.findOne).toHaveBeenCalledWith({ where: { id: mockProject.id } });
      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException if project not found', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(undefined);
      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateProjectDto = { status: ProjectStatus.COMPLETED };

    it('should update a project successfully', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProject); // Mock finding existing project
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(undefined); // New name is unique (if name changed)
      jest.spyOn(projectRepository, 'save').mockResolvedValue({ ...mockProject, ...updateDto });

      const result = await service.update(mockProject.id, updateDto);
      expect(service.findOne).toHaveBeenCalledWith(mockProject.id);
      expect(projectRepository.save).toHaveBeenCalled();
      expect(result.status).toEqual(updateDto.status);
    });

    it('should throw NotFoundException if project to update is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException()); // Mock findOne to fail
      await expect(service.update('non-existent-id', updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if new project name is not unique', async () => {
      const updateDtoWithNameChange: UpdateProjectDto = { name: 'Existing Project Name' };
      const existingProjectWithSameName: Project = { ...mockProject, id: 'another-project-uuid', name: 'Existing Project Name' };

      jest.spyOn(service, 'findOne').mockResolvedValue({ ...mockProject, name: 'Original Name' }); // Mock original project with different name
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(existingProjectWithSameName); // Name already exists

      await expect(service.update(mockProject.id, updateDtoWithNameChange)).rejects.toThrow(ConflictException);
      expect(projectRepository.findOne).toHaveBeenCalledWith({ where: { name: updateDtoWithNameChange.name } });
    });
  });

  describe('remove', () => {
    it('should remove a project successfully', async () => {
      jest.spyOn(projectRepository, 'delete').mockResolvedValue({ affected: 1, raw: [] });
      await service.remove(mockProject.id);
      expect(projectRepository.delete).toHaveBeenCalledWith(mockProject.id);
    });

    it('should throw NotFoundException if project to remove is not found', async () => {
      jest.spyOn(projectRepository, 'delete').mockResolvedValue({ affected: 0, raw: [] });
      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
