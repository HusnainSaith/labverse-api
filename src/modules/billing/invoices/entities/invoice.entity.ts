import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Project } from '../../../project-management/projects/entities/projects.entity';
import { ClientPlanQuotation } from '../../../client-plan-quotations/entities/client-plan-quotation.entity';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import { InvoiceItem } from '../../invoice-items/entities/invoice-item.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Client } from '../../../crm/clients/entities/clients.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // No invoice_number in your SQL, but usually good to have.
  // Adding it here as a common practice, make it unique if desired.
  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  invoice_number: string;

  @Column({ type: 'uuid', nullable: false })
  client_id: string;

  @Column({ type: 'uuid', nullable: true })
  project_id: string;

  @Column({ type: 'uuid', nullable: true })
  quotation_id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: InvoiceStatus.UNPAID,
  })
  status: InvoiceStatus;

  @Column({ type: 'date', nullable: false })
  issue_date: Date;

  @Column({ type: 'date', nullable: false })
  due_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  paid_amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Client, clients => clients.invoices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Project, project => project.invoices, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => ClientPlanQuotation, quotation => quotation.invoices, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'quotation_id' })
  quotation: ClientPlanQuotation;

  @OneToMany(() => InvoiceItem, invoiceItem => invoiceItem.invoice)
  invoiceItems: InvoiceItem[];

  @OneToMany(() => Payment, payment => payment.invoice)
  payments: Payment[];
}