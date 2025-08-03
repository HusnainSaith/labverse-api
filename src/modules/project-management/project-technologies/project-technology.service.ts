import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTechnology } from './entities/project-technology.entity';
import { CreateProjectTechnologyDto } from './dto/create-project-technology.dto';
import { Project } from '../projects/entities/projects.entity';
import { Technology } from 'src/modules/technology/entities/technology.entity';

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

  async create(createProjectTechnologyDto: CreateProjectTechnologyDto): Promise<ProjectTechnology> {
    const { projectId, technologyId } = createProjectTechnologyDto;

    // Check if project exists
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException(`Project with ID "${projectId}" not found.`);
    }

    // Check if technology exists
    const technology = await this.technologyRepository.findOne({ where: { id: technologyId } });
    if (!technology) {
      throw new NotFoundException(`Technology with ID "${technologyId}" not found.`);
    }

    // Check if the association already exists
    const existingProjectTechnology = await this.projectTechnologyRepository.findOne({
      where: { projectId, technologyId },
    });
    if (existingProjectTechnology) {
      throw new ConflictException(`Project with ID "${projectId}" is already associated with Technology ID "${technologyId}".`);
    }

    const projectTechnology = this.projectTechnologyRepository.create(createProjectTechnologyDto);
    return this.projectTechnologyRepository.save(projectTechnology);
  }

  async findAll(): Promise<ProjectTechnology[]> {
    return this.projectTechnologyRepository.find({
      relations: ['project', 'technology'],
    });
  }

  async findOne(projectId: string, technologyId: string): Promise<ProjectTechnology> {
    const projectTechnology = await this.projectTechnologyRepository.findOne({
      where: { projectId, technologyId },
      relations: ['project', 'technology'],
    });
    if (!projectTechnology) {
      throw new NotFoundException(`ProjectTechnology association not found for Project ID "${projectId}" and Technology ID "${technologyId}".`);
    }
    return projectTechnology;
  }

  async remove(projectId: string, technologyId: string): Promise<void> {
    const result = await this.projectTechnologyRepository.delete({ projectId, technologyId });
    if (result.affected === 0) {
      throw new NotFoundException(`ProjectTechnology association not found for Project ID "${projectId}" and Technology ID "${technologyId}".`);
    }
  }
}
