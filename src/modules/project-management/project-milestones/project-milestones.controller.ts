import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProjectMilestoneService } from './project-milestones.service';
import { CreateProjectMilestoneDto } from './dto/create-project-milestone.dto';
import { UpdateProjectMilestoneDto } from './dto/update-project-milestone.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('project-milestones')
export class ProjectMilestoneController {
  constructor(private readonly milestoneService: ProjectMilestoneService) {}

  @Post()
  create(@Body() dto: CreateProjectMilestoneDto) {
    return this.milestoneService.create(dto);
  }

  @Get()
  findAll() {
    return this.milestoneService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.milestoneService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectMilestoneDto) {
    return this.milestoneService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.milestoneService.remove(id);
  }
}
