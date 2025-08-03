import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../projects/entities/projects.entity';
import { EmployeeProfile } from '../../../hr/employees/entities/employee.entity';

@Entity('project_updates')
export class ProjectUpdate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @Column({ name: 'updated_by', type: 'uuid' })
  updatedBy: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'update_date', type: 'date' })
  updateDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => EmployeeProfile)
  @JoinColumn({ name: 'updated_by' })
  updatedByEmployee: EmployeeProfile;
}