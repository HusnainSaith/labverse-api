import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DevelopmentPlan } from '../../development-plans/entities/development-plan.entity';
// Assuming you have a Technology entity from Milestone 2 (or Technology Management)
import { Technology } from '../../../technology/entities/technology.entity';

@Entity('development_plan_technologies')
export class DevelopmentPlanTechnology {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  plan_id: string;

  @Column({ type: 'uuid', nullable: false })
  technology_id: string;

  // Relationships
  @ManyToOne(
    () => DevelopmentPlan,
    (plan) => plan.developmentPlanTechnologies,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'plan_id' })
  plan: DevelopmentPlan;

  @ManyToOne(
    () => Technology,
    (technology) => technology.developmentPlanTechnologies,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'technology_id' })
  technology: Technology;
}
