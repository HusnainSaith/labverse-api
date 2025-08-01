import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMilestone } from './entities/project-milestone.entity';
import { ProjectMilestoneService } from './project-milestones.service';
import { ProjectMilestoneController } from './project-milestones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectMilestone])],
  controllers: [ProjectMilestoneController],
  providers: [ProjectMilestoneService],
  exports: [ProjectMilestoneService],
})
export class ProjectMilestoneModule {}
