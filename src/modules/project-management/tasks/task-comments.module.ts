import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskComment } from './entities/task-comment.entity';
import { TaskCommentService } from './task-comments.service';
import { TaskCommentController } from './task-comments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TaskComment])],
  controllers: [TaskCommentController],
  providers: [TaskCommentService],
  exports: [TaskCommentService],
})
export class TaskCommentModule {}
