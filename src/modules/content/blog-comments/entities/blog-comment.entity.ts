import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BlogPost } from '../../blog-posts/entities/blog-post.entity';

@Entity('blog_comments')
export class BlogComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'post_id', type: 'uuid' })
  postId: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string;

  @Column({ name: 'guest_name', nullable: true })
  guestName: string;

  @Column({ name: 'guest_email', nullable: true })
  guestEmail: string;

  @Column({ name: 'comment_content', type: 'text' })
  commentContent: string;

  @Column({ name: 'parent_comment_id', type: 'uuid', nullable: true })
  parentCommentId: string;

  @Column({ name: 'is_approved', default: false })
  isApproved: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => BlogPost)
  @JoinColumn({ name: 'post_id' })
  blogPost: BlogPost;

  @ManyToOne(() => BlogComment)
  @JoinColumn({ name: 'parent_comment_id' })
  parentComment: BlogComment;
}