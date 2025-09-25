import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-clients.dto';
import { UpdateClientDto } from './dto/update-clients.dto';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new client with optional profile photo' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profile_photo'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Acme Corporation' },
        email: { type: 'string', example: 'contact@acmecorp.com' },
        phone: { type: 'string', example: '+1-555-123-4567' },
        company: { type: 'string', example: 'Acme Corp' },
        address: { type: 'string', example: '123 Main St, City' },
        website: { type: 'string', example: 'https://acme.com' },
        profile_photo: { type: 'string', format: 'binary' },
      },
      required: ['name'],
    },
  })
  async create(
    @Body() createClientDto: CreateClientDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2 MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    profile_photo?: Express.Multer.File,
  ) {
    return this.clientsService.create(createClientDto, profile_photo);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all clients' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved all clients.',
  })
  async findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve a client by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client found.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client not found.',
  })
  async findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }


  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update an existing client' })
  @ApiConsumes('multipart/form-data') // 👈 required for file upload
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'john@example.com' },
        phone: { type: 'string', example: '+123456789' },
        company: { type: 'string', example: 'Acme Inc.' },
        address: { type: 'string', example: '123 Main Street' },
        website: { type: 'string', example: 'https://example.com' },
        profile_photo: { type: 'string', format: 'binary' }, // 👈 only one file field
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The client has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client not found.',
  })
  @UseInterceptors(FileInterceptor('profile_photo'))
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @UploadedFile() profile_photo?: Express.Multer.File,
  ) {
    return this.clientsService.update(id, updateClientDto, profile_photo);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a client' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The client has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client not found.',
  })
  async remove(@Param('id') id: string) {
    await this.clientsService.remove(id);
  }
}
