import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { EmployeeStatus } from '../dto/employee-status.enum';
import { Task } from '../../../project-management/tasks/entities/task.entity';
import { TaskComment } from '../../../project-management/tasks/entities/task-comment.entity';
import { TimeEntry } from '../../../project-management/time-entries/entities/time-entry.entity';
import { ProjectUpdate } from '../../../project-management/project-updates/entities/project-update.entity';

@Entity({ name: 'employee_profiles' })
export class EmployeeProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'employee_code', unique: true, length: 100 })
  employeeCode: string;

  @Column({ name: 'hire_date', type: 'date', nullable: true })
  hireDate: Date;

  @Column({ name: 'job_title', length: 255, nullable: true })
  jobTitle: string;

  @Column({ length: 255, nullable: true })
  department: string;

  @Column({ type: 'varchar', length: 50, default: EmployeeStatus.ACTIVE })
  status: EmployeeStatus;



  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
