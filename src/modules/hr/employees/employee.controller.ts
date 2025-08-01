import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EmployeeProfilesService } from './employee.service';
import { CreateEmployeeProfileDto } from './dto/create-employee.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee.dto';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RoleEnum } from '../../roles/role.enum';
import { Roles } from '../../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employee-profiles')
export class EmployeeProfilesController {
  constructor(private readonly employeeProfilesService: EmployeeProfilesService) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  create(@Body() createEmployeeProfileDto: CreateEmployeeProfileDto) {
    return this.employeeProfilesService.create(createEmployeeProfileDto);
  }

  @Get()
  findAll() {
    return this.employeeProfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeProfilesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeProfileDto: UpdateEmployeeProfileDto) {
    return this.employeeProfilesService.update(id, updateEmployeeProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeProfilesService.remove(id);
  }
}
