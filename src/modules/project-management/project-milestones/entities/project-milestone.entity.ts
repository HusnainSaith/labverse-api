import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Project } from '../../projects/entities/projects.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('project_milestones')
export class ProjectMilestone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, (project) => project.milestones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamptz', nullable: true })
  due_date: Date;

  @Column({ default: 'Not Started' })
  status: string;
  @OneToMany(() => Task, (task) => task.project_milestone)
tasks: Task[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
