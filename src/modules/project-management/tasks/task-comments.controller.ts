import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskCommentService } from './task-comments.service';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { UpdateTaskCommentDto } from './dto/update-task-comment.dto';

@Controller('task-comments')
export class TaskCommentController {
  constructor(private readonly taskCommentService: TaskCommentService) {}

  @Post()
  create(@Body() dto: CreateTaskCommentDto) {
    return this.taskCommentService.create(dto);
  }

  @Get()
  findAll() {
    return this.taskCommentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskCommentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskCommentDto) {
    return this.taskCommentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskCommentService.remove(id);
  }
}
