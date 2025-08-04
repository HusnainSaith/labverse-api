import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUpdate } from './entities/project-update.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectUpdate])],
  exports: [TypeOrmModule],
})
export class ProjectUpdateModule {}
