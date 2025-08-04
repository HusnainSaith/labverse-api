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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER)
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER, RoleEnum.CLIENT)
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER, RoleEnum.CLIENT, RoleEnum.EMPLOYEE)
  findOne(@Param('id', UuidValidationPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER)
  update(@Param('id', UuidValidationPipe) id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  remove(@Param('id', UuidValidationPipe) id: string) {
    return this.projectsService.remove(id);
  }

  @Get(':id/detail')
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER, RoleEnum.CLIENT)
  async getProjectDetails(@Param('id', UuidValidationPipe) id: string) {
    return this.projectsService.getProjectDetails(id);
  }

  @Get('client/:clientId')
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER, RoleEnum.CLIENT)
  findByClient(@Param('clientId', UuidValidationPipe) clientId: string) {
    return this.projectsService.findByClient(clientId);
  }

}
