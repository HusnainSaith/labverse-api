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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { RoleEnum } from '../../roles/role.enum';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UuidValidationPipe } from '../../../common/pipes/uuid-validation.pipe';
import { SecurityUtil } from '../../../common/utils/security.util';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employee-profiles')
export class EmployeeProfilesController {
  constructor(
    private readonly employeeProfilesService: EmployeeProfilesService,
  ) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  create(@Body() createEmployeeProfileDto: CreateEmployeeProfileDto) {
    return this.employeeProfilesService.create(createEmployeeProfileDto); 
  }

  @Get()
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER)
  findAll() {
    return this.employeeProfilesService.findAll();
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER, RoleEnum.EMPLOYEE)
  findOne(@Param('id', UuidValidationPipe) id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.employeeProfilesService.findOne(validId);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  update(
    @Param('id', UuidValidationPipe) id: string,
    @Body() updateEmployeeProfileDto: UpdateEmployeeProfileDto,
  ) {
    const validId = SecurityUtil.validateId(id);
    return this.employeeProfilesService.update(
      validId,
      updateEmployeeProfileDto,
    );
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  remove(@Param('id', UuidValidationPipe) id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.employeeProfilesService.remove(validId);
  }
}
