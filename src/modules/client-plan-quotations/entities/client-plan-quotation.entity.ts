import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Client } from '../../crm/clients/entities/clients.entity';
import { DevelopmentPlan } from '../../development/development-plans/entities/development-plan.entity';
import { User } from '../../users/entities/user.entity'; // Assuming users module exists
import { ClientPlanQuotationStatus } from '../enums/client-plan-quotation-status.enum';
import { Invoice } from '../../billing/invoices/entities/invoice.entity';

@Entity('client_plan_quotations')
export class ClientPlanQuotation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  client_id: string;

  @Column({ type: 'uuid', nullable: true })
  plan_id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: ClientPlanQuotationStatus.DRAFT,
  })
  status: ClientPlanQuotationStatus;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  discount_percent: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_amount: number;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Client, (client) => client.clientPlanQuotations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => DevelopmentPlan, (plan) => plan.clientPlanQuotations, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'plan_id' })
  plan: DevelopmentPlan;

  @ManyToOne(() => User, (user) => user.createdClientPlanQuotations, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToMany(() => Invoice, (invoice) => invoice.quotation)
  invoices: Invoice[];

  @ManyToOne(() => User, (user) => user.createdClientPlanQuotations, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;
}
