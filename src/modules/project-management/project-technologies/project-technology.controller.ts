import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ProjectTechnologiesService } from './project-technology.service';
import { CreateProjectTechnologiesDto } from './dto/create-project-technology.dto';
import { UpdateProjectTechnologyDto } from './dto/update-project-technology.dto';
import { RolesGuard } from 'src/common/guards/roles.guard'; // Adjust path
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from '../../roles/role.enum'

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
  @ApiOperation({ summary: 'Create a new project technology association (bulk)' })
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER, RoleEnum.DEVELOPER)
  create(@Body() createProjectTechnologiesDto: CreateProjectTechnologiesDto) {
    return this.projectTechnologiesService.create(createProjectTechnologiesDto);
  }

  @Patch(':projectId/:oldTechnologyId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a project technology association' })
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER, RoleEnum.DEVELOPER)
  update(
    @Param('projectId') projectId: string,
    @Param('oldTechnologyId') oldTechnologyId: string,
    @Body() dto: UpdateProjectTechnologyDto,
  ) {
    return this.projectTechnologiesService.update(projectId, oldTechnologyId, dto);
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
