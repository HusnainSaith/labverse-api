import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMember } from './entities/project-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectMember])],
  exports: [TypeOrmModule],
})
export class ProjectMembersModule {}