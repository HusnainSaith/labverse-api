import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DevelopmentPlanService } from '../../development/development-plan-services/entities/development-plan-service.entity';
import { InvoiceItem } from '../../billing/invoice-items/entities/invoice-item.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  base_price: number; // Stored as number in JS, decimal in DB

  @Column({ type: 'int', nullable: true })
  duration_in_days: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // Relationships
  @OneToMany(
    () => DevelopmentPlanService,
    (developmentPlanService) => developmentPlanService.service,
  )
  developmentPlanServices: DevelopmentPlanService[];

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.serviceId)
  invoiceItems: InvoiceItem[];
}
