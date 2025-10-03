import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeProfilesService } from './employee.service';
import { EmployeeProfilesController } from './employee.controller';
import { EmployeeProfile } from './entities/employee.entity';
import { User } from '../../users/entities/user.entity';
import { SupabaseService } from 'src/common/services/supabase.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeProfile, User])],
  controllers: [EmployeeProfilesController],
  providers: [EmployeeProfilesService, SupabaseService],
  exports: [EmployeeProfilesService, SupabaseService],
})
export class EmployeeProfilesModule {}
