import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/projects.entity';
import { ProjectMilestone } from '../../project-milestones/entities/project-milestone.entity';
import { EmployeeProfile } from '../../../hr/employees/entities/employee.entity';
import { TaskComment } from './task-comment.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'To Do' })
  status: string;

  @Column({ default: 'Medium' })
  priority: string;

  @Column({ type: 'timestamptz', nullable: true })
  due_date: Date;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  project: Project;

  @ManyToOne(() => ProjectMilestone, (milestone) => milestone.tasks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  project_milestone: ProjectMilestone;

  @ManyToOne(() => EmployeeProfile, {
    onDelete: 'RESTRICT',
  })
  created_by_employee_profile: EmployeeProfile;

  @ManyToOne(() => EmployeeProfile, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  assigned_to_employee_profile: EmployeeProfile;

  @OneToMany(() => TaskComment, (comment) => comment.task, {
    cascade: true,
  })
  comments: TaskComment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
