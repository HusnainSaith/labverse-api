import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogComment } from './entities/blog-comment.entity';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
import { UpdateBlogCommentDto } from './dto/update-blog-comment.dto';

@Injectable()
export class BlogCommentsService {
  constructor(
    @InjectRepository(BlogComment)
    private blogCommentRepository: Repository<BlogComment>,
  ) {}

  create(createBlogCommentDto: CreateBlogCommentDto) {
    const comment = this.blogCommentRepository.create(createBlogCommentDto);
    return this.blogCommentRepository.save(comment);
  }

  findAll() {
    return this.blogCommentRepository.find({ relations: ['post', 'parentComment'] });
  }

  findOne(id: string) {
    return this.blogCommentRepository.findOne({ where: { id }, relations: ['post', 'parentComment'] });
  }

  update(id: string, updateBlogCommentDto: UpdateBlogCommentDto) {
    return this.blogCommentRepository.update(id, updateBlogCommentDto);
  }

  remove(id: string) {
    return this.blogCommentRepository.delete(id);
  }
}