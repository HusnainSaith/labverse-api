import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/projects.entity';
import { EmployeeProfile } from '../../../hr/employees/entities/employee.entity';

@Entity('project_members')
export class ProjectMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({ nullable: true })
  role: string;

  @Column({ name: 'joined_date', type: 'date' })
  joinedDate: Date;

  @Column({ name: 'left_date', type: 'date', nullable: true })
  leftDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => EmployeeProfile)
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeProfile;
}
