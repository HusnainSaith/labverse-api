import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { SupabaseService } from 'src/common/services/supabase.service';
import { CreateProjectDto } from './dto/create-projects.dto';
import { UpdateProjectDto } from './dto/update-projects.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  private readonly logger = new Logger(ProjectsController.name);

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new project with optional multiple image uploads',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @UseInterceptors(FilesInterceptor('files', 10))
  async create(
    @Body() body: any,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp|gif)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    files?: Express.Multer.File[],
  ) {
    try {
      let createProjectDto: CreateProjectDto;

      // Manually parse the JSON string from the 'data' field
      if (body.data) {
        createProjectDto = plainToClass(
          CreateProjectDto,
          JSON.parse(body.data),
        );
      } else {
        // Fallback for non-multipart requests
        createProjectDto = plainToClass(CreateProjectDto, body);
      }

      // Explicitly validate the DTO
      const errors = await validate(createProjectDto);
      if (errors.length > 0) {
        const messages = errors.flatMap((error) =>
          Object.values(error.constraints),
        );
        throw new BadRequestException(messages);
      }

      if (files && files.length > 0) {
        // Upload all files concurrently using Promise.all
        const uploadPromises = files.map((file) =>
          this.supabaseService.uploadImage(file, 'projects'),
        );
        const imageUrls = await Promise.all(uploadPromises);
        createProjectDto.images = imageUrls;
      } else {
        createProjectDto.images = [];
      }

      return await this.projectsService.create(createProjectDto);
    } catch (error) {
      this.logger.error(`Failed to create project: ${error.message}`);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  async findAll() {
    try {
      return await this.projectsService.findAll();
    } catch (error) {
      this.logger.error(`Failed to retrieve projects: ${error.message}`);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.projectsService.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to retrieve project ${id}: ${error.message}`);
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    try {
      return await this.projectsService.update(id, updateProjectDto);
    } catch (error) {
      this.logger.error(`Failed to update project ${id}: ${error.message}`);
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async remove(@Param('id') id: string) {
    try {
      return await this.projectsService.remove(id);
    } catch (error) {
      this.logger.error(`Failed to delete project ${id}: ${error.message}`);
      throw error;
    }
  }
}
