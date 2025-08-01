import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/projects.entity';
import { CreateProjectDto } from './dto/create-projects.dto';
import { UpdateProjectDto } from './dto/update-projects.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const { name } = createProjectDto;

    // Check if project name already exists
    const existingProject = await this.projectRepository.findOne({ where: { name } });
    if (existingProject) {
      throw new ConflictException(`Project with name "${name}" already exists.`);
    }

    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found.`);
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id); // Reuses findOne to check existence

    if (updateProjectDto.name && updateProjectDto.name !== project.name) {
      // Check if the new name is unique
      const existingProject = await this.projectRepository.findOne({ where: { name: updateProjectDto.name } });
      if (existingProject && existingProject.id !== id) {
        throw new ConflictException(`Project with name "${updateProjectDto.name}" already exists.`);
      }
    }

    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID "${id}" not found.`);
    }
  }

  async getProjectDetails(id: string): Promise<any> {
  const project = await this.projectRepository.findOne({
    where: { id },
    relations: [
      'projectTechnologies', 'projectTechnologies.technology', 'members', 'members.employee', 'members.employee.user',

    ],
  });

  if (!project) {
    throw new NotFoundException(`Project with ID "${id}" not found.`);
  }

return {
  id: project.id,
  name: project.name,
  description: project.description,
  status: project.status,
  technologies: project.projectTechnologies?.map((pt) => ({
    id: pt.technology.id,
    name: pt.technology.name,
  })) || [],
  members: project.members.map((member) => ({
    id: member.employee?.id,
    name: member.employee?.user?.fullName ?? '',
  })),
};
  }}
