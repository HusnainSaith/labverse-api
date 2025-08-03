import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogCommentsService } from './blog-comments.service';
import { BlogCommentsController } from './blog-comments.controller';
import { BlogComment } from './entities/blog-comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogComment])],
  controllers: [BlogCommentsController],
  providers: [BlogCommentsService],
  exports: [BlogCommentsService],
})
export class BlogCommentsModule {}