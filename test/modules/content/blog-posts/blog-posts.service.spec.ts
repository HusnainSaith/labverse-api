import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostsService } from '../../../../src/modules/content/blog-posts/blog-posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BlogPost } from '../../../../src/modules/content/blog-posts/entities/blog-post.entity';
import { mockRepository } from '../../../utils/test-helpers';

describe('BlogPostsService', () => {
  let service: BlogPostsService;
  let blogPostRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogPostsService,
        { provide: getRepositoryToken(BlogPost), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<BlogPostsService>(BlogPostsService);
    blogPostRepository = module.get(getRepositoryToken(BlogPost));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new blog post', async () => {
      const createBlogPostDto = {
        title: 'Test Blog Post',
        slug: 'test-blog-post',
        content: 'This is test content',
        authorId: 'author-id',
      };
      const mockBlogPost = { id: 'post-id', ...createBlogPostDto };

      blogPostRepository.create.mockReturnValue(mockBlogPost);
      blogPostRepository.save.mockResolvedValue(mockBlogPost);

      const result = await service.create(createBlogPostDto);

      expect(result).toEqual(mockBlogPost);
      expect(blogPostRepository.create).toHaveBeenCalledWith(createBlogPostDto);
    });
  });

  describe('findAll', () => {
    it('should return array of blog posts', async () => {
      const mockBlogPosts = [{ id: 'post-id', title: 'Test Blog Post' }];
      blogPostRepository.find.mockResolvedValue(mockBlogPosts);

      const result = await service.findAll();

      expect(result).toEqual(mockBlogPosts);
      expect(blogPostRepository.find).toHaveBeenCalled();
    });
  });
});