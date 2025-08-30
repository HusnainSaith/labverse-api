import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/projects.entity';
import { Client } from 'src/modules/crm/clients/entities/clients.entity';
import { SupabaseService } from 'src/common/services/supabase.service';
import { User } from 'src/modules/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project,User, Client])],
  controllers: [ProjectsController],
  providers: [ProjectsService, SupabaseService],
  exports: [ProjectsService, SupabaseService],
})
export class ProjectsModule {}
