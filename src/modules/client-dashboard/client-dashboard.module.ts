import { Module } from '@nestjs/common';
import { ProjectMilestoneModule } from '../project-management/project-milestones/project-milestones.module';
import { ProjectUpdateModule } from '../project-management/project-updates/project-updates.module';
// You might also need the ProjectsModule here if client-specific project fetching is handled.
// import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [ProjectMilestoneModule, ProjectUpdateModule], // Add ProjectsModule if needed
  // You might have a specific ClientDashboardController/Service that leverages these modules
  // controllers: [ClientDashboardController],
  // providers: [ClientDashboardService],
  exports: [ProjectMilestoneModule, ProjectUpdateModule], // Export if other parts of the app need them
})
export class ClientDashboardModule {}