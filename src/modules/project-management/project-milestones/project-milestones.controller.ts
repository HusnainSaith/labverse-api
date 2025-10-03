import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectMilestoneService } from './project-milestones.service';
import { CreateProjectMilestoneDto } from './dto/create-project-milestone.dto';
import { UpdateProjectMilestoneDto } from './dto/update-project-milestone.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Project Milestones')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('project-milestones')
export class ProjectMilestoneController {
  constructor(private readonly milestoneService: ProjectMilestoneService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new project milestone' })
  create(@Body() dto: CreateProjectMilestoneDto) {
    return this.milestoneService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all project milestones' })
  findAll() {
    return this.milestoneService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve a project milestone by ID' })
  findOne(@Param('id') id: string) {
    return this.milestoneService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a project milestone by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateProjectMilestoneDto) {
    return this.milestoneService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a project milestone by ID' })
  remove(@Param('id') id: string) {
    return this.milestoneService.remove(id);
  }
}
