import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DevelopmentPlan } from '../../development-plans/entities/development-plan.entity';
import { Service } from '../../../services/entities/service.entity';

@Entity('development_plan_services')
export class DevelopmentPlanService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  plan_id: string;

  @Column({ type: 'uuid', nullable: false })
  service_id: string;

  // Relationships
  @ManyToOne(() => DevelopmentPlan, (plan) => plan.developmentPlanServices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'plan_id' })
  plan: DevelopmentPlan;

  @ManyToOne(() => Service, (service) => service.developmentPlanServices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service: Service;
}
