import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner, DataSource } from 'typeorm';
import { CreateProjectDto } from './dto/create-projects.dto';
import { UpdateProjectDto } from './dto/update-projects.dto';
import { Project } from './entities/projects.entity';
import { Client } from '../../crm/clients/entities/clients.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { SafeLogger } from 'src/common/utils/logger.util';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly dataSource: DataSource,
  ) {}

  /**
   * Create a new project with proper validation and error handling.
   */
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate date logic
      if (createProjectDto.startDate && createProjectDto.endDate) {
        const startDate = new Date(createProjectDto.startDate);
        const endDate = new Date(createProjectDto.endDate);

        if (startDate >= endDate) {
          throw new BadRequestException('Start date must be before end date');
        }
      }

      // Check if project with same name already exists
      const existingProject = await this.projectRepository.findOne({
        where: { name: createProjectDto.name },
      });

      if (existingProject) {
        throw new ConflictException('A project with this name already exists');
      }

      // Create project entity
      const project = this.projectRepository.create({
        ...createProjectDto,
        startDate: createProjectDto.startDate ? new Date(createProjectDto.startDate) : null,
        endDate: createProjectDto.endDate ? new Date(createProjectDto.endDate) : null,
        images: createProjectDto.images || [],
      });

      // Save project
      const savedProject = await queryRunner.manager.save(Project, project);

      await queryRunner.commitTransaction();

      SafeLogger.log(`Project created successfully: ${savedProject.id}`, 'ProjectsService');
      return savedProject;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      SafeLogger.error(`Failed to create project: ${error.message}`, 'ProjectsService');

      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create project');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Retrieve all projects
   */
  async findAll(): Promise<Project[]> {
    try {
      SafeLogger.log('Fetching all projects...', 'ProjectsService');

      const projects = await this.projectRepository.find({
        order: { createdAt: 'DESC' },
      });

      SafeLogger.log(`Retrieved ${projects.length} projects`, 'ProjectsService');

      return projects;
    } catch (error) {
      SafeLogger.error(`Failed to retrieve projects: ${error.message}`, 'ProjectsService', error.stack);
      throw new InternalServerErrorException('Failed to retrieve projects');
    }
  }

  /**
   * Find a project by ID
   */
  async findOne(id: string): Promise<Project> {
    try {
      if (!id || typeof id !== 'string') {
        throw new BadRequestException('Invalid project ID provided');
      }

      const project = await this.projectRepository.findOne({
        where: { id },
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      SafeLogger.log(`Project retrieved: ${project.id}`, 'ProjectsService');
      return project;

    } catch (error) {
      SafeLogger.error(`Failed to find project ${id}: ${error.message}`, 'ProjectsService');

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to retrieve project');
    }
  }

  /**
   * Update a project with validation
   */
  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // First, find the existing project
      const existingProject = await this.findOne(id);

      // Validate date logic if dates are being updated
      const startDate = updateProjectDto.startDate ? new Date(updateProjectDto.startDate) : existingProject.startDate;
      const endDate = updateProjectDto.endDate ? new Date(updateProjectDto.endDate) : existingProject.endDate;

      if (startDate && endDate && startDate >= endDate) {
        throw new BadRequestException('Start date must be before end date');
      }

      // Check for name conflicts (if name is being updated)
      if (updateProjectDto.name && updateProjectDto.name !== existingProject.name) {
        const nameConflict = await this.projectRepository.findOne({
          where: { name: updateProjectDto.name },
        });

        if (nameConflict) {
          throw new ConflictException('A project with this name already exists');
        }
      }

      // Prepare update data
      const updateData = {
        ...updateProjectDto,
        startDate: updateProjectDto.startDate ? new Date(updateProjectDto.startDate) : undefined,
        endDate: updateProjectDto.endDate ? new Date(updateProjectDto.endDate) : undefined,
      };

      // Update the project
      await queryRunner.manager.update(Project, id, updateData);

      // Fetch updated project
      const updatedProject = await queryRunner.manager.findOne(Project, {
        where: { id },
      });

      await queryRunner.commitTransaction();

      SafeLogger.log(`Project updated successfully: ${id}`, 'ProjectsService');
      return updatedProject;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      SafeLogger.error(`Failed to update project ${id}: ${error.message}`, 'ProjectsService');

      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update project');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Delete a project with proper cleanup
   */
  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // First, check if project exists
      const project = await this.findOne(id);

      // Delete the project
      const deleteResult = await queryRunner.manager.delete(Project, id);

      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      await queryRunner.commitTransaction();

      SafeLogger.log(`Project deleted successfully: ${id}`, 'ProjectsService');
      return {
        success: true,
        message: 'Project deleted successfully',
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      SafeLogger.error(`Failed to delete project ${id}: ${error.message}`, 'ProjectsService');

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to delete project');
    } finally {
      await queryRunner.release();
    }
  }
}
