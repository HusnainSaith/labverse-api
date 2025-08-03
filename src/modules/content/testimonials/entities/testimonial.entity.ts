import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('testimonials')
export class Testimonial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quote_content', type: 'text' })
  quoteContent: string;

  @Column({ name: 'author_name' })
  authorName: string;

  @Column({ name: 'author_title_company', nullable: true })
  authorTitleCompany: string;

  @Column({ name: 'author_avatar_url', nullable: true })
  authorAvatarUrl: string;

  @Column({ name: 'is_approved', default: false })
  isApproved: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}