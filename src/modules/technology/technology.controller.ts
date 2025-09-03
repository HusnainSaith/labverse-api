import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
  Logger
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TechnologiesService } from './technology.service';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { RoleEnum } from '../roles/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Technologies')
@Controller('technologies')
export class TechnologiesController {
  private readonly logger = new Logger(TechnologiesController.name);

  constructor(private readonly technologiesService: TechnologiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new technology with optional logo upload' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Technology created successfully' })
  @Roles(RoleEnum.ADMIN, RoleEnum.DEVELOPER, RoleEnum.PROJECT_MANAGER)
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() body: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp|gif|svg\+xml)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    logo?: Express.Multer.File,
  ) {
    try {
      let createTechnologyDto: CreateTechnologyDto;

      // Parse the 'data' field as JSON to get the DTO
      if (body.data) {
        createTechnologyDto = plainToClass(CreateTechnologyDto, JSON.parse(body.data));
      } else {
        // Fallback for requests without a 'data' field, parsing directly from body
        createTechnologyDto = plainToClass(CreateTechnologyDto, body);
      }

      const errors = await validate(createTechnologyDto);
      if (errors.length > 0) {
        const messages = errors.flatMap(error => Object.values(error.constraints));
        throw new BadRequestException(messages);
      }

      return await this.technologiesService.create(createTechnologyDto, logo);
    } catch (error) {
      this.logger.error(`Failed to create technology: ${error.message}`);
      throw error;
    }
  }

  @Get()
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all technologies' })
  findAll() {
    return this.technologiesService.findAll();
  }

  @Get(':id')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve a technology by ID' })
  findOne(@Param('id') id: string) {
    return this.technologiesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a technology with optional logo upload' })
  @ApiConsumes('multipart/form-data')
  @Roles(RoleEnum.ADMIN, RoleEnum.DEVELOPER, RoleEnum.PROJECT_MANAGER)
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp|gif|svg\+xml)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    logo?: Express.Multer.File,
  ) {
    try {
      let updateTechnologyDto: UpdateTechnologyDto;

      if (body.data) {
        updateTechnologyDto = plainToClass(UpdateTechnologyDto, JSON.parse(body.data));
      } else {
        updateTechnologyDto = plainToClass(UpdateTechnologyDto, body);
      }

      const errors = await validate(updateTechnologyDto);
      if (errors.length > 0) {
        const messages = errors.flatMap(error => Object.values(error.constraints));
        throw new BadRequestException(messages);
      }

      return await this.technologiesService.update(id, updateTechnologyDto, logo);
    } catch (error) {
      this.logger.error(`Failed to update technology ${id}: ${error.message}`);
      throw error;
    }
  }

  @Delete(':id')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a technology' })
  @Roles(RoleEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.technologiesService.remove(id);
  }
}
