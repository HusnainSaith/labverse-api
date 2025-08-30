// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   HttpCode,
//   HttpStatus,
//   UseGuards,
// } from '@nestjs/common';
// import { ClientsService } from './clients.service';
// import { CreateClientDto } from './dto/create-clients.dto';
// import { UpdateClientDto } from './dto/update-clients.dto';
// import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
// import { SecurityUtil } from 'src/common/utils/security.util';
// import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

// @ApiTags('clients')
// @Controller('clients')
// export class ClientsController {
//   constructor(private readonly clientsService: ClientsService) {}

//   @Post()
//     @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth('JWT-auth')
//   @HttpCode(HttpStatus.CREATED)
//   @ApiOperation({ summary: 'Create a new client' })
//   @ApiResponse({
//     status: HttpStatus.CREATED,
//     description: 'The client has been successfully created.',
//     type: CreateClientDto,
//   })
//   async create(@Body() createClientDto: CreateClientDto) {
//     return this.clientsService.create(createClientDto);
//   }

//   @Get()
//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth('JWT-auth')
//   @ApiOperation({ summary: 'Retrieve all clients' })
//   @ApiResponse({
//     status: HttpStatus.OK,
//     description: 'Successfully retrieved all clients.',
//     type: [CreateClientDto],
//   })
//   async findAll() {
//     return this.clientsService.findAll();
//   }

//   @Get(':id')
//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth('JWT-auth')
//   @ApiOperation({ summary: 'Retrieve a client by ID' })
//   @ApiResponse({
//     status: HttpStatus.OK,
//     description: 'Client found.',
//     type: CreateClientDto,
//   })
//   @ApiResponse({
//     status: HttpStatus.NOT_FOUND,
//     description: 'Client not found.',
//   })
//   async findOne(@Param('id') id: string) {
//     return this.clientsService.findOne(id);
//   }

//   @Patch(':id')
//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth('JWT-auth')
//   @ApiOperation({ summary: 'Update an existing client' })
//   @ApiResponse({
//     status: HttpStatus.OK,
//     description: 'The client has been successfully updated.',
//     type: CreateClientDto,
//   })
//   @ApiResponse({
//     status: HttpStatus.NOT_FOUND,
//     description: 'Client not found.',
//   })
//   async update(
//     @Param('id') id: string,
//     @Body() updateClientDto: UpdateClientDto,
//   ) {
//     return this.clientsService.update(id, updateClientDto);
//   }

//   @Delete(':id')  @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth('JWT-auth')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   @ApiOperation({ summary: 'Delete a client' })
//   @ApiResponse({
//     status: HttpStatus.NO_CONTENT,
//     description: 'The client has been successfully deleted.',
//   })
//   @ApiResponse({
//     status: HttpStatus.NOT_FOUND,
//     description: 'Client not found.',
//   })
//   async remove(@Param('id') id: string) {
//     await this.clientsService.remove(id);
//   }
// }


// src/clients/clients.controller.ts
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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-clients.dto';
import { UpdateClientDto } from './dto/update-clients.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { SecurityUtil } from 'src/common/utils/security.util';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new client with an optional profile photo' })
  @ApiConsumes('multipart/form-data')
 @ApiBody({
  schema: {
    type: 'object',
    properties: {
      userId: { type: 'string', format: 'uuid' },
      employeeCode: { type: 'string' },
      hireDate: { type: 'string', format: 'date' },
      jobTitle: { type: 'string' },
      department: { type: 'string' },
      status: { type: 'string' },
      file: {
        type: 'string',
        format: 'binary',
      },
    },
    required: ['userId', 'employeeCode'], // ✅ Correct: This is an array of strings.
  },
})
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The client has been successfully created.',
  })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createClientDto: CreateClientDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.clientsService.create(createClientDto, file);
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The client has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, updateClientDto);
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

  @Patch(':id/profile-photo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Upload or update a client\'s profile photo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Profile photo to upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile photo uploaded successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client not found.',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.clientsService.uploadProfilePhoto(id, file);
  }
}
