import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectTechnologiesService } from './project-technology.service';
import { ProjectTechnologiesController } from './project-technology.controller';
import { ProjectTechnology } from './entities/project-technology.entity';
import { Project } from '../projects/entities/projects.entity';
import { Technology } from 'src/modules/technology/entities/technology.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectTechnology, Project, Technology])],
  controllers: [ProjectTechnologiesController],
  providers: [ProjectTechnologiesService],
  exports: [ProjectTechnologiesService],
})
export class ProjectTechnologiesModule {}
