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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-projects.dto';
import { UpdateProjectDto } from './dto/update-projects.dto';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleEnum } from '../../roles/role.enum';
import { UuidValidationPipe } from '../../../common/pipes/uuid-validation.pipe';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create a new project' })
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER)
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all projects' })
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER, RoleEnum.CLIENT)
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve a project by ID' })
  @Roles(
    RoleEnum.ADMIN,
    RoleEnum.PROJECT_MANAGER,
    RoleEnum.CLIENT,
    RoleEnum.EMPLOYEE,
  )
  findOne(@Param('id', UuidValidationPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a project by ID' })
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER)
  update(
    @Param('id', UuidValidationPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a project by ID' })
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER)
  remove(@Param('id', UuidValidationPipe) id: string) {
    return this.projectsService.remove(id);
  }

  @Get(':id/detail')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve project details by ID' })
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER, RoleEnum.CLIENT)
  async getProjectDetails(@Param('id', UuidValidationPipe) id: string) {
    return this.projectsService.getProjectDetails(id);
  }

  @Get('client/:clientId')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all project technology associations' })
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER, RoleEnum.CLIENT)
  findByClient(@Param('clientId', UuidValidationPipe) clientId: string) {
    return this.projectsService.findByClient(clientId);
  }
}
