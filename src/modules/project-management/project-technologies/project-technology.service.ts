import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ProjectTechnology } from './entities/project-technology.entity';
import { CreateProjectTechnologiesDto } from './dto/create-project-technology.dto';
import { Project } from '../projects/entities/projects.entity';
import { Technology } from '../../technology/entities/technology.entity';
import { SecurityUtil } from '../../../common/utils/security.util';
import { DataSource } from 'typeorm';
import { UpdateProjectTechnologyDto } from './dto/update-project-technology.dto';

@Injectable()
export class ProjectTechnologiesService {
  constructor(
    @InjectRepository(ProjectTechnology)
    private readonly projectTechnologyRepository: Repository<ProjectTechnology>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
    private dataSource: DataSource,
  ) {}

  async create(
    dto: CreateProjectTechnologiesDto,
  ): Promise<ProjectTechnology[]> {
    SecurityUtil.validateObject(dto);
    const { projectId, technologyIds } = dto;

    if (!projectId || technologyIds.length === 0) {
      throw new BadRequestException(
        'Project ID and at least one Technology ID are required.',
      );
    }

    const validProjectId = SecurityUtil.validateId(projectId);
    const validTechnologyIds = technologyIds.map((id) =>
      SecurityUtil.validateId(id),
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const project = await queryRunner.manager.findOne(Project, {
        where: { id: validProjectId },
      });
      if (!project) {
        throw new NotFoundException(
          `Project with ID "${projectId}" not found.`,
        );
      }

      const technologies = await queryRunner.manager.find(Technology, {
        where: validTechnologyIds.map((id) => ({ id })),
      });
      if (technologies.length !== validTechnologyIds.length) {
        throw new NotFoundException('One or more technologies were not found.');
      }

      const existingAssociations = await queryRunner.manager.find(
        ProjectTechnology,
        {
          where: {
            projectId: validProjectId,
            technologyId: In(validTechnologyIds),
          },
        },
      );

      if (existingAssociations.length > 0) {
        const existingMessage = existingAssociations
          .map((assoc) => `(Technology ID: ${assoc.technologyId})`)
          .join(', ');
        throw new ConflictException(
          `One or more project-technology associations already exist for this project: ${existingMessage}`,
        );
      }

      const newAssociations = validTechnologyIds.map((techId) =>
        this.projectTechnologyRepository.create({
          projectId: validProjectId,
          technologyId: techId,
        }),
      );

      const savedAssociations = await queryRunner.manager.save(newAssociations);

      await queryRunner.commitTransaction();
      return savedAssociations;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    projectId: string,
    oldTechnologyId: string,
    dto: UpdateProjectTechnologyDto,
  ): Promise<ProjectTechnology> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const validProjectId = SecurityUtil.validateId(projectId);
      const validOldTechnologyId = SecurityUtil.validateId(oldTechnologyId);
      const validNewTechnologyId = SecurityUtil.validateId(dto.newTechnologyId);

      const existingAssociation = await queryRunner.manager.findOne(
        ProjectTechnology,
        {
          where: {
            projectId: validProjectId,
            technologyId: validOldTechnologyId,
          },
        },
      );

      if (!existingAssociation) {
        throw new NotFoundException(
          'Project technology association not found.',
        );
      }

      const newTechnology = await queryRunner.manager.findOne(Technology, {
        where: { id: validNewTechnologyId },
      });

      if (!newTechnology) {
        throw new NotFoundException('New technology not found.');
      }

      const conflictAssociation = await queryRunner.manager.findOne(
        ProjectTechnology,
        {
          where: {
            projectId: validProjectId,
            technologyId: validNewTechnologyId,
          },
        },
      );

      if (conflictAssociation) {
        throw new ConflictException(
          'A project technology association with the new technology already exists.',
        );
      }

      await queryRunner.manager.remove(existingAssociation);

      const newAssociation = this.projectTechnologyRepository.create({
        projectId: validProjectId,
        technologyId: validNewTechnologyId,
      });

      const savedAssociation = await queryRunner.manager.save(newAssociation);

      await queryRunner.commitTransaction();
      return savedAssociation;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<ProjectTechnology[]> {
    return this.projectTechnologyRepository.find({
      relations: ['project', 'technology'],
    });
  }

  async findOne(
    projectId: string,
    technologyId: string,
  ): Promise<ProjectTechnology> {
    const validProjectId = SecurityUtil.validateId(projectId);
    const validTechnologyId = SecurityUtil.validateId(technologyId);
    const projectTechnology = await this.projectTechnologyRepository.findOne({
      where: { projectId: validProjectId, technologyId: validTechnologyId },
      relations: ['project', 'technology'],
    });
    if (!projectTechnology) {
      throw new NotFoundException(
        `ProjectTechnology association not found for Project ID "${projectId}" and Technology ID "${technologyId}".`,
      );
    }
    return projectTechnology;
  }

  async remove(projectId: string, technologyId: string): Promise<void> {
    const validProjectId = SecurityUtil.validateId(projectId);
    const validTechnologyId = SecurityUtil.validateId(technologyId);
    const result = await this.projectTechnologyRepository.delete({
      projectId: validProjectId,
      technologyId: validTechnologyId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        `ProjectTechnology association not found for Project ID "${projectId}" and Technology ID "${technologyId}".`,
      );
    }
  }
}
