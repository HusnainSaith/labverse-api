import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/projects.entity';
import { CreateProjectDto } from './dto/create-projects.dto';
import { UpdateProjectDto } from './dto/update-projects.dto';
import { Client } from 'src/modules/crm/clients/entities/clients.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    try {
      const { name, creatorId, startDate, endDate } = createProjectDto;

      // Validate date logic
      if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        throw new BadRequestException('Start date must be before end date');
      }

      // Check if project name already exists
      const existingProject = await this.projectRepository.findOne({ where: { name } });
      if (existingProject) {
        throw new ConflictException(`Project with name "${name}" already exists.`);
      }

      // Validate creator exists if provided
      if (creatorId) {
        const creator = await this.clientRepository.findOne({ where: { id: creatorId } });
        if (!creator) {
          throw new NotFoundException(`Client with ID "${creatorId}" not found.`);
        }
      }

      const project = this.projectRepository.create(createProjectDto);
      return await this.projectRepository.save(project);
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create project');
    }
  }

  async findAll(): Promise<Project[]> {
    try {
      return await this.projectRepository.find({ relations: ['creator'] });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve projects');
    }
  }

  async findOne(id: string): Promise<Project> {
    try {
      const project = await this.projectRepository.findOne({ 
        where: { id },
        relations: ['creator']
      });
      if (!project) {
        throw new NotFoundException(`Project with ID "${id}" not found`);
      }
      return project;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve project');
    }
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    try {
      const project = await this.findOne(id);
      const { startDate, endDate } = updateProjectDto;

      // Validate date logic
      const newStartDate = startDate || project.startDate;
      const newEndDate = endDate || project.endDate;
      if (newStartDate && newEndDate && new Date(newStartDate) >= new Date(newEndDate)) {
        throw new BadRequestException('Start date must be before end date');
      }

      if (updateProjectDto.name && updateProjectDto.name !== project.name) {
        const existingProject = await this.projectRepository.findOne({ where: { name: updateProjectDto.name } });
        if (existingProject && existingProject.id !== id) {
          throw new ConflictException(`Project with name "${updateProjectDto.name}" already exists.`);
        }
      }

      if (updateProjectDto.creatorId) {
        const creator = await this.clientRepository.findOne({ where: { id: updateProjectDto.creatorId } });
        if (!creator) {
          throw new NotFoundException(`Client with ID "${updateProjectDto.creatorId}" not found.`);
        }
      }

      Object.assign(project, updateProjectDto);
      return await this.projectRepository.save(project);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update project');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const result = await this.projectRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Project with ID "${id}" not found`);
      }
      return { message: 'Project successfully deleted' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete project');
    }
  }

  async getProjectDetails(id: string): Promise<any> {
    try {
      const project = await this.projectRepository.findOne({
        where: { id },
        relations: [
          'projectTechnologies', 'projectTechnologies.technology', 'members', 'members.employee', 'members.employee.user',
        ],
      });

      if (!project) {
        throw new NotFoundException(`Project with ID "${id}" not found`);
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
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve project details');
    }
  }

  async findByClient(clientId: string): Promise<Project[]> {
    try {
      // Validate client exists
      const client = await this.clientRepository.findOne({ where: { id: clientId } });
      if (!client) {
        throw new NotFoundException(`Client with ID "${clientId}" not found.`);
      }

      // Find all projects for the client
      const projects = await this.projectRepository.find({ 
        where: { creatorId: clientId },
        relations: ['creator']
      });

      return projects;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Error retrieving projects for client');
    }
  }}
