import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleEnum } from '../../roles/role.enum';
import { UuidValidationPipe } from '../../../common/pipes/uuid-validation.pipe';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER)
  create(@Body() dto: CreateTaskDto) {
    return this.taskService.create(dto);
  }

  @Get()
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER, RoleEnum.EMPLOYEE)
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER, RoleEnum.EMPLOYEE)
  findOne(@Param('id', UuidValidationPipe) id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER, RoleEnum.EMPLOYEE)
  update(
    @Param('id', UuidValidationPipe) id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER)
  remove(@Param('id', UuidValidationPipe) id: string) {
    return this.taskService.remove(id);
  }
}
