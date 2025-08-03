import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.blogCommentRepository.find({ relations: ['blogPost', 'parentComment'] });
  }

  findOne(id: string) {
    return this.blogCommentRepository.findOne({ where: { id }, relations: ['blogPost', 'parentComment'] });
  }

 async update(id: string, updateBlogCommentDto: UpdateBlogCommentDto) {
  await this.blogCommentRepository.update(id, updateBlogCommentDto);
  return this.findOne(id);
}


async remove(id: string) {
  const result = await this.blogCommentRepository.delete(id);
  if (result.affected === 0) {
    throw new NotFoundException(`Blog comment with ID "${id}" not found.`);
  }
  return { message: 'Blog comment successfully deleted' };
}

}