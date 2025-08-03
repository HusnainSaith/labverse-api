import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogPostsService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
  ) {}

  create(createBlogPostDto: CreateBlogPostDto) {
    const blogPost = this.blogPostRepository.create(createBlogPostDto);
    return this.blogPostRepository.save(blogPost);
  }

  findAll() {
    return this.blogPostRepository.find({ relations: ['category'] });
  }

  findOne(id: string) {
    return this.blogPostRepository.findOne({ where: { id }, relations: ['category'] });
  }

  update(id: string, updateBlogPostDto: UpdateBlogPostDto) {
    return this.blogPostRepository.update(id, updateBlogPostDto);
  }

  remove(id: string) {
    return this.blogPostRepository.delete(id);
  }
}