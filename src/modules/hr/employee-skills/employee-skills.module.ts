import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeSkill } from './entities/employee-skills.entity';
import { EmployeeSkillsController } from './employee-skills.controller';
import { EmployeeSkillsService } from './employee-skills.service';
import { EmployeeProfile } from '../employees/entities/employee.entity';
import { Skill } from '../skills/entities/skills.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeSkill, EmployeeProfile, Skill])],
  controllers: [EmployeeSkillsController],
  providers: [EmployeeSkillsService],
  exports: [TypeOrmModule, EmployeeSkillsService],
})
export class EmployeeSkillsModule {}
