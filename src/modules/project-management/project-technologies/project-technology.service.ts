import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTechnology } from './entities/project-technology.entity';
import { CreateProjectTechnologyDto } from './dto/create-project-technology.dto';
import { Project } from '../projects/entities/projects.entity';
import { Technology } from 'src/modules/technology/entities/technology.entity';
import { SecurityUtil } from '../../../common/utils/security.util';

@Injectable()
export class ProjectTechnologiesService {
  constructor(
    @InjectRepository(ProjectTechnology)
    private readonly projectTechnologyRepository: Repository<ProjectTechnology>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
  ) {}

  async create(
    createProjectTechnologyDto: CreateProjectTechnologyDto,
  ): Promise<ProjectTechnology> {
    SecurityUtil.validateObject(createProjectTechnologyDto);
    const { projectId, technologyId } = createProjectTechnologyDto;

    const validProjectId = SecurityUtil.validateId(projectId);
    const validTechnologyId = SecurityUtil.validateId(technologyId);
    // Check if project exists
    const project = await this.projectRepository.findOne({
      where: { id: validProjectId },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID "${projectId}" not found.`);
    }

    // Check if technology exists
    const technology = await this.technologyRepository.findOne({
      where: { id: validTechnologyId },
    });
    if (!technology) {
      throw new NotFoundException(
        `Technology with ID "${technologyId}" not found.`,
      );
    }

    // Check if the association already exists
    const existingProjectTechnology =
      await this.projectTechnologyRepository.findOne({
        where: { projectId: validProjectId, technologyId: validTechnologyId },
      });
    if (existingProjectTechnology) {
      throw new ConflictException(
        `Project with ID "${projectId}" is already associated with Technology ID "${technologyId}".`,
      );
    }

    const projectTechnology = this.projectTechnologyRepository.create(
      createProjectTechnologyDto,
    );
    return this.projectTechnologyRepository.save(projectTechnology);
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
