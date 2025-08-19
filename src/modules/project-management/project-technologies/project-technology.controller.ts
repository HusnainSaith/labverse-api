import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectTechnologiesService } from './project-technology.service';
import { CreateProjectTechnologyDto } from './dto/create-project-technology.dto';
import { RolesGuard } from 'src/common/guards/roles.guard'; // Adjust path
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Project Technologies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('project-technologies')
export class ProjectTechnologiesController {
  constructor(
    private readonly projectTechnologiesService: ProjectTechnologiesService,
  ) {}

  @Post()
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new project technology association' })
  create(@Body() createProjectTechnologyDto: CreateProjectTechnologyDto) {
    return this.projectTechnologiesService.create(createProjectTechnologyDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all project technology associations' })
  findAll() {
    return this.projectTechnologiesService.findAll();
  }

  @Get(':projectId/:technologyId')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve a project technology association by IDs' })
  findOne(
    @Param('projectId') projectId: string,
    @Param('technologyId') technologyId: string,
  ) {
    return this.projectTechnologiesService.findOne(projectId, technologyId);
  }

  // Note: Update operation for junction tables like this is often handled by
  // deleting and re-creating the association if the primary keys change.
  // If there were other fields on the junction table, a Patch method would be more common.
  // For now, we'll omit a direct Patch method as it's less common for simple associations.

  @Delete(':projectId/:technologyId')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a project technology association by IDs' })
  remove(
    @Param('projectId') projectId: string,
    @Param('technologyId') technologyId: string,
  ) {
    return this.projectTechnologiesService.remove(projectId, technologyId);
  }
}
