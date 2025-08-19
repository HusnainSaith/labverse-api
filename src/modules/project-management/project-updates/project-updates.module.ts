import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUpdate } from './entities/project-update.entity';
import { ProjectUpdatesService } from './project-updates.service';
import { ProjectUpdatesController } from './project-updates.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectUpdate])],
  providers: [ProjectUpdatesService],
  controllers: [ProjectUpdatesController],
  exports: [TypeOrmModule, ProjectUpdatesService],
})
export class ProjectUpdatesModule {}
