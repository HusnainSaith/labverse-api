import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Invoice } from '../../invoices/entities/invoice.entity';

export enum PaymentMethod {
  CREDIT_CARD = 'Credit Card',
  BANK_TRANSFER = 'Bank Transfer',
  PAYPAL = 'PayPal',
  CASH = 'Cash',
  CHECK = 'Check',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'invoice_id', type: 'uuid' })
  invoiceId: string;

  @Column({ name: 'payment_amount', type: 'decimal', precision: 10, scale: 2 })
  paymentAmount: number;

  @Column({ name: 'payment_date', type: 'date' })
  paymentDate: Date;

  @Column({ name: 'payment_method', type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ name: 'transaction_reference', nullable: true })
  transactionReference: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Invoice)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;
}
