import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProjectStatus } from '../dto/project-status.enum';
import { Task } from '../../tasks/entities/task.entity';
import { TimeEntry } from '../../time-entries/entities/time-entry.entity';
import { ProjectUpdate } from '../../project-updates/entities/project-update.entity';
import { ProjectMilestone } from '../../project-milestones/entities/project-milestone.entity';
import { ProjectMember } from '../../project-members/entities/project-member.entity';
import { ProjectTechnology } from '../../project-technologies/entities/project-technology.entity';
import { Invoice } from '../../../billing/invoices/entities/invoice.entity';
import { Client } from '../../../../modules/crm/clients/entities/clients.entity';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'start_date',
    type: 'timestamp with time zone',
    nullable: true,
  })
  startDate: Date;

  @Column({
    name: 'end_date',
    type: 'timestamp with time zone',
    nullable: true,
  })
  endDate: Date;

  @Column({ type: 'varchar', length: 50, default: ProjectStatus.PLANNING })
  status: ProjectStatus;

  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true })
  budget: number;

  @Column({ name: 'creator_id', type: 'uuid', nullable: true })
  creatorId: string;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'creator_id' })
  creator: Client;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @OneToMany(() => TimeEntry, (timeEntry) => timeEntry.project)
  timeEntries: TimeEntry[];

  @OneToMany(() => ProjectUpdate, (update) => update.project)
  updates: ProjectUpdate[];

  @OneToMany(() => ProjectMilestone, (milestone) => milestone.project)
  milestones: ProjectMilestone[];

  @OneToMany(() => ProjectMember, (member) => member.project)
  members: ProjectMember[];

  @OneToMany(() => ProjectTechnology, (pt) => pt.project)
  projectTechnologies: ProjectTechnology[];

  @OneToMany(() => Invoice, (invoice) => invoice.project)
  invoices: Invoice[]; // This property name 'invoices' matches the error message

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
