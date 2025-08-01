import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../projects/entities/projects.entity';
import { EmployeeProfile } from '../../../hr/employees/entities/employee.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('time_entries')
export class TimeEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'task_id', type: 'uuid', nullable: true })
  taskId: string;

  @Column({ name: 'hours_worked', type: 'decimal', precision: 5, scale: 2 })
  hoursWorked: number;

  @Column({ name: 'work_date', type: 'date' })
  workDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

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

  @ManyToOne(() => Task)
  @JoinColumn({ name: 'task_id' })
  task: Task;
}