import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectUpdatesService } from './project-updates.service';
import { CreateProjectUpdateDto } from './dto/create-project-update.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
@ApiTags('Project Updates')
@Controller('project-updates')
export class ProjectUpdatesController {
  constructor(private readonly projectUpdatesService: ProjectUpdatesService) {}

  @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create a new project update' })
  async create(@Body() dto: CreateProjectUpdateDto) {
    return await this.projectUpdatesService.create(dto);
  }

  @Get()
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all project updates' })
  async findAll() {
    return await this.projectUpdatesService.findAll();
  }

  @Get(':id')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get an project update by ID' })
  async findOne(@Param('id') id: string) {
    return await this.projectUpdatesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update an project update by ID' })
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateProjectUpdateDto>,
  ) {
    return await this.projectUpdatesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete an project update by ID' })
  async remove(@Param('id') id: string) {
    return await this.projectUpdatesService.remove(id);
  }
}
