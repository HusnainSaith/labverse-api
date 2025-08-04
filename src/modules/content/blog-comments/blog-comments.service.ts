import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogComment } from './entities/blog-comment.entity';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
import { UpdateBlogCommentDto } from './dto/update-blog-comment.dto';
import { SecurityUtil } from '../../../common/utils/security.util';

@Injectable()
export class BlogCommentsService {
  constructor(
    @InjectRepository(BlogComment)
    private blogCommentRepository: Repository<BlogComment>,
  ) {}

  create(createBlogCommentDto: CreateBlogCommentDto) {
    SecurityUtil.validateObject(createBlogCommentDto);
    const comment = this.blogCommentRepository.create(createBlogCommentDto);
    return this.blogCommentRepository.save(comment);
  }

  findAll() {
    return this.blogCommentRepository.find({
      relations: ['blogPost', 'parentComment'],
    });
  }

  findOne(id: string) {
    const validId = SecurityUtil.validateId(id);
    return this.blogCommentRepository.findOne({
      where: { id: validId },
      relations: ['blogPost', 'parentComment'],
    });
  }

  async update(id: string, updateBlogCommentDto: UpdateBlogCommentDto) {
    SecurityUtil.validateObject(updateBlogCommentDto);
    const validId = SecurityUtil.validateId(id);
    await this.blogCommentRepository.update(validId, updateBlogCommentDto);
    return this.findOne(validId);
  }

  async remove(id: string) {
    const validId = SecurityUtil.validateId(id);
    const result = await this.blogCommentRepository.delete(validId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Blog comment with ID "${validId}" not found.`,
      );
    }
    return { message: 'Blog comment successfully deleted' };
  }
}
