import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/projects.entity';
import { CreateProjectDto } from './dto/create-projects.dto';
import { UpdateProjectDto } from './dto/update-projects.dto';
import { Client } from '../../crm/clients/entities/clients.entity';
import { SecurityUtil } from '../../../common/utils/security.util';
import { ValidationUtil } from '../../../common/utils/validation.util';
import { SafeLogger } from '../../../common/utils/logger.util';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<{ success: boolean; message: string; data: Project }> {
    ValidationUtil.validateString(createProjectDto.name, 'name', 2, 100);
    if (createProjectDto.description) {
      ValidationUtil.validateString(createProjectDto.description, 'description', 0, 1000);
    }
    if (createProjectDto.creatorId) {
      ValidationUtil.validateUUID(createProjectDto.creatorId, 'creatorId');
    }
    if (createProjectDto.startDate) {
      ValidationUtil.validateDate(createProjectDto.startDate, 'startDate');
    }
    if (createProjectDto.endDate) {
      ValidationUtil.validateDate(createProjectDto.endDate, 'endDate');
    }
    if (createProjectDto.status) {
      ValidationUtil.validateString(createProjectDto.status, 'status', 1, 50);
    }

    const { name, creatorId, startDate, endDate } = createProjectDto;

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      throw new BadRequestException('Start date must be before end date');
    }

    const existingProject = await this.projectRepository.findOne({
      where: { name: ValidationUtil.sanitizeString(name) },
    });
    if (existingProject) {
      throw new ConflictException(`Project with name "${name}" already exists`);
    }

    if (creatorId) {
      const creator = await this.clientRepository.findOne({
        where: { id: creatorId },
      });
      if (!creator) {
        throw new NotFoundException(`Client with ID "${creatorId}" not found`);
      }
    }

    const project = this.projectRepository.create({
      ...createProjectDto,
      name: ValidationUtil.sanitizeString(name),
      description: createProjectDto.description ? ValidationUtil.sanitizeString(createProjectDto.description) : undefined,
    });
    const savedProject = await this.projectRepository.save(project);
    
    SafeLogger.log(`Project created successfully: ${name}`, 'ProjectsService');
    return {
      success: true,
      message: 'Project created successfully',
      data: savedProject
    };
  }

  async findAll(): Promise<{ success: boolean; message: string; data: Project[] }> {
    const projects = await this.projectRepository.find({ relations: ['creator'] });
    return {
      success: true,
      message: 'Projects retrieved successfully',
      data: projects
    };
  }

  async findOne(id: string): Promise<{ success: boolean; message: string; data: Project }> {
    ValidationUtil.validateUUID(id, 'projectId');
    
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['creator'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    
    return {
      success: true,
      message: 'Project retrieved successfully',
      data: project
    };
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<{ success: boolean; message: string; data: Project }> {
    ValidationUtil.validateUUID(id, 'projectId');
    
    if (updateProjectDto.name) {
      ValidationUtil.validateString(updateProjectDto.name, 'name', 2, 100);
    }
    if (updateProjectDto.description !== undefined) {
      if (updateProjectDto.description) {
        ValidationUtil.validateString(updateProjectDto.description, 'description', 0, 1000);
      }
    }
    if (updateProjectDto.creatorId) {
      ValidationUtil.validateUUID(updateProjectDto.creatorId, 'creatorId');
    }
    if (updateProjectDto.startDate) {
      ValidationUtil.validateDate(updateProjectDto.startDate, 'startDate');
    }
    if (updateProjectDto.endDate) {
      ValidationUtil.validateDate(updateProjectDto.endDate, 'endDate');
    }
    if (updateProjectDto.status) {
      ValidationUtil.validateString(updateProjectDto.status, 'status', 1, 50);
    }

    const projectResult = await this.findOne(id);
    const project = projectResult.data;
    const { startDate, endDate } = updateProjectDto;

    const newStartDate = startDate || project.startDate;
    const newEndDate = endDate || project.endDate;
    if (
      newStartDate &&
      newEndDate &&
      new Date(newStartDate) >= new Date(newEndDate)
    ) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (updateProjectDto.name && updateProjectDto.name !== project.name) {
      const existingProject = await this.projectRepository.findOne({
        where: { name: ValidationUtil.sanitizeString(updateProjectDto.name) },
      });
      if (existingProject && existingProject.id !== id) {
        throw new ConflictException(
          `Project with name "${updateProjectDto.name}" already exists`,
        );
      }
    }

    if (updateProjectDto.creatorId) {
      const creator = await this.clientRepository.findOne({
        where: { id: updateProjectDto.creatorId },
      });
      if (!creator) {
        throw new NotFoundException(
          `Client with ID "${updateProjectDto.creatorId}" not found`,
        );
      }
    }

    const updateData = {
      ...updateProjectDto,
      ...(updateProjectDto.name && { name: ValidationUtil.sanitizeString(updateProjectDto.name) }),
      ...(updateProjectDto.description !== undefined && { 
        description: updateProjectDto.description ? ValidationUtil.sanitizeString(updateProjectDto.description) : null 
      }),
    };

    Object.assign(project, updateData);
    const updatedProject = await this.projectRepository.save(project);
    
    SafeLogger.log(`Project updated successfully: ${id}`, 'ProjectsService');
    return {
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    };
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    ValidationUtil.validateUUID(id, 'projectId');
    
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    
    SafeLogger.log(`Project deleted successfully: ${id}`, 'ProjectsService');
    return {
      success: true,
      message: 'Project deleted successfully'
    };
  }

  async getProjectDetails(id: string): Promise<{ success: boolean; message: string; data: any }> {
    ValidationUtil.validateUUID(id, 'projectId');
    
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: [
        'projectTechnologies',
        'projectTechnologies.technology',
        'members',
        'members.employee',
        'members.employee.user',
      ],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    const projectDetails = {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      technologies:
        project.projectTechnologies?.map((pt) => ({
          id: pt.technology.id,
          name: pt.technology.name,
        })) || [],
      members: project.members?.map((member) => ({
        id: member.employee?.id,
        name: member.employee?.user?.fullName ?? '',
      })) || [],
    };

    return {
      success: true,
      message: 'Project details retrieved successfully',
      data: projectDetails
    };
  }

  async findByClient(clientId: string): Promise<{ success: boolean; message: string; data: Project[] }> {
    ValidationUtil.validateUUID(clientId, 'clientId');
    
    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID "${clientId}" not found`);
    }

    const projects = await this.projectRepository.find({
      where: { creatorId: clientId },
      relations: ['creator'],
    });

    return {
      success: true,
      message: 'Client projects retrieved successfully',
      data: projects
    };
  }
}
