import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/projects.entity';
import { Technology } from '../../../technology/entities/technology.entity';

@Entity({ name: 'project_technologies' })
export class ProjectTechnology {
  @PrimaryColumn({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @PrimaryColumn({ name: 'technology_id', type: 'uuid' })
  technologyId: string;

  @ManyToOne(() => Project, project => project.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Technology, technology => technology.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'technology_id' })
  technology: Technology;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
