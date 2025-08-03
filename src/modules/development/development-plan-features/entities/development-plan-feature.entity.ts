import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DevelopmentPlan } from '../../development-plans/entities/development-plan.entity';
import { PlanFeature } from 'src/modules/plan-features/entities/plan-feature.entity';

@Entity('development_plan_features')
export class DevelopmentPlanFeature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  plan_id: string;

  @Column({ type: 'uuid', nullable: false })
  feature_id: string;

  // Relationships
  @ManyToOne(() => DevelopmentPlan, plan => plan.developmentPlanFeatures, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plan_id' })
  plan: DevelopmentPlan;

  @ManyToOne(() => PlanFeature, feature => feature.developmentPlanFeatures, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'feature_id' })
  feature: PlanFeature;
}