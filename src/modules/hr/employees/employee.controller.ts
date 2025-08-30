// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Patch,
//   Delete,
//   UseGuards,
// } from '@nestjs/common';
// import { EmployeeProfilesService } from './employee.service';
// import { CreateEmployeeProfileDto } from './dto/create-employee.dto';
// import { UpdateEmployeeProfileDto } from './dto/update-employee.dto';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../../../common/guards/roles.guard';
// import { RoleEnum } from '../../roles/role.enum';
// import { Roles } from '../../../common/decorators/roles.decorator';
// import { UuidValidationPipe } from '../../../common/pipes/uuid-validation.pipe';
// import { SecurityUtil } from '../../../common/utils/security.util';
// import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

// @ApiTags('Employee Profiles')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Controller('employee-profiles')
// export class EmployeeProfilesController {
//   constructor(
//     private readonly employeeProfilesService: EmployeeProfilesService,
//   ) {}

//   @Post()
//     @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth('JWT-auth')
//   @ApiOperation({ summary: 'Create a new employee profile' })
//   @Roles(RoleEnum.ADMIN)
//   create(@Body() createEmployeeProfileDto: CreateEmployeeProfileDto) {
//     return this.employeeProfilesService.create(createEmployeeProfileDto); 
//   }

//   @Get()
//     @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth('JWT-auth')
//   @ApiOperation({ summary: 'Retrieve all employee profiles' })
//   @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER)
//   findAll() {
//     return this.employeeProfilesService.findAll();
//   }

//   @Get(':id')
//     @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth('JWT-auth')
//   @ApiOperation({ summary: 'Retrieve a specific employee profile' })
//   @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER, RoleEnum.EMPLOYEE)
//   findOne(@Param('id', UuidValidationPipe) id: string) {
//     const validId = SecurityUtil.validateId(id);
//     return this.employeeProfilesService.findOne(validId);
//   }

//   @Patch(':id')
//     @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth('JWT-auth')
//   @ApiOperation({ summary: 'Update a specific employee profile' })
//   @Roles(RoleEnum.ADMIN)
//   update(
//     @Param('id', UuidValidationPipe) id: string,
//     @Body() updateEmployeeProfileDto: UpdateEmployeeProfileDto,
//   ) {
//     const validId = SecurityUtil.validateId(id);
//     return this.employeeProfilesService.update(
//       validId,
//       updateEmployeeProfileDto,
//     );
//   }

//   @Delete(':id')
//     @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth('JWT-auth')
//   @ApiOperation({ summary: 'Delete a specific employee profile' })
//   @Roles(RoleEnum.ADMIN)
//   remove(@Param('id', UuidValidationPipe) id: string) {
//     const validId = SecurityUtil.validateId(id);
//     return this.employeeProfilesService.remove(validId);
//   }
// }

// src/employee-profiles/employee.controller.ts
// src/employee-profiles/employee.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmployeeProfilesService } from './employee.service';
import { CreateEmployeeProfileDto } from './dto/create-employee.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { RoleEnum } from '../../roles/role.enum';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UuidValidationPipe } from '../../../common/pipes/uuid-validation.pipe';
import { SecurityUtil } from '../../../common/utils/security.util';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Employee Profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employee-profiles')
export class EmployeeProfilesController {
  constructor(
    private readonly employeeProfilesService: EmployeeProfilesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new employee profile with an optional image' })
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
    required: ['userId', 'employeeCode'], 
  },
})
  @Roles(RoleEnum.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createEmployeeProfileDto: CreateEmployeeProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.employeeProfilesService.create(createEmployeeProfileDto, file);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all employee profiles' })
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER)
  findAll() {
    return this.employeeProfilesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve a specific employee profile' })
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER, RoleEnum.EMPLOYEE)
  findOne(@Param('id', UuidValidationPipe) id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.employeeProfilesService.findOne(validId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a specific employee profile' })
  @Roles(RoleEnum.ADMIN)
  update(
    @Param('id', UuidValidationPipe) id: string,
    @Body() updateEmployeeProfileDto: UpdateEmployeeProfileDto,
  ) {
    const validId = SecurityUtil.validateId(id);
    return this.employeeProfilesService.update(
      validId,
      updateEmployeeProfileDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a specific employee profile' })
  @Roles(RoleEnum.ADMIN)
  remove(@Param('id', UuidValidationPipe) id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.employeeProfilesService.remove(validId);
  }

  @Patch(':id/image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Upload or update a profile image for an employee' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Profile image to upload',
    type: 'multipart/form-data',
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
  @Roles(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @Param('id', UuidValidationPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const validId = SecurityUtil.validateId(id);
    return this.employeeProfilesService.uploadProfileImage(validId, file);
  }
}
