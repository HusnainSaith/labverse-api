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
import { EmployeeSkillsService } from './employee-skills.service';
import { CreateEmployeeSkillDto } from './dto/create-employee-skill.dto';
import { UpdateEmployeeSkillDto } from './dto/update-employee-skill.dto';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Employee Skills')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employee-skills')
export class EmployeeSkillsController {
  constructor(private readonly employeeSkillsService: EmployeeSkillsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new employee skill' })
  create(@Body() createEmployeeSkillDto: CreateEmployeeSkillDto) {
    return this.employeeSkillsService.create(createEmployeeSkillDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all employee skills' })
  findAll() {
    return this.employeeSkillsService.findAll();
  }

  @Get('employee/:employeeId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Retrieve all employee skills for a specific employee',
  })
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.employeeSkillsService.findByEmployee(employeeId);
  }

  @Get(':employeeId/:skillId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve a specific employee skill' })
  findOne(
    @Param('employeeId') employeeId: string,
    @Param('skillId') skillId: string,
  ) {
    return this.employeeSkillsService.findOne(employeeId, skillId);
  }

  @Patch(':employeeId/:skillId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a specific employee skill' })
  update(
    @Param('employeeId') employeeId: string,
    @Param('skillId') skillId: string,
    @Body() updateEmployeeSkillDto: UpdateEmployeeSkillDto,
  ) {
    return this.employeeSkillsService.update(
      employeeId,
      skillId,
      updateEmployeeSkillDto,
    );
  }

  @Delete(':employeeId/:skillId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a specific employee skill' })
  remove(
    @Param('employeeId') employeeId: string,
    @Param('skillId') skillId: string,
  ) {
    return this.employeeSkillsService.remove(employeeId, skillId);
  }
}
