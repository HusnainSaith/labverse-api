import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { EmployeeSkillsService } from './employee-skills.service';
import { CreateEmployeeSkillDto } from './dto/create-employee-skill.dto';
import { UpdateEmployeeSkillDto } from './dto/update-employee-skill.dto';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RoleEnum } from '../../roles/role.enum';
import { Roles } from '../../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employee-skills')
export class EmployeeSkillsController {
  constructor(private readonly employeeSkillsService: EmployeeSkillsService) {}

  @Post()
  // @Roles(RoleEnum.ADMIN)
  create(@Body() createEmployeeSkillDto: CreateEmployeeSkillDto) {
    return this.employeeSkillsService.create(createEmployeeSkillDto);
  }

  @Get()
  findAll() {
    return this.employeeSkillsService.findAll();
  }

  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.employeeSkillsService.findByEmployee(employeeId);
  }

  @Get(':employeeId/:skillId')
  findOne(@Param('employeeId') employeeId: string, @Param('skillId') skillId: string) {
    return this.employeeSkillsService.findOne(employeeId, skillId);
  }

  @Patch(':employeeId/:skillId')
  update(@Param('employeeId') employeeId: string, @Param('skillId') skillId: string, @Body() updateEmployeeSkillDto: UpdateEmployeeSkillDto) {
    return this.employeeSkillsService.update(employeeId, skillId, updateEmployeeSkillDto);
  }

  @Delete(':employeeId/:skillId')
  remove(@Param('employeeId') employeeId: string, @Param('skillId') skillId: string) {
    return this.employeeSkillsService.remove(employeeId, skillId);
  }
}