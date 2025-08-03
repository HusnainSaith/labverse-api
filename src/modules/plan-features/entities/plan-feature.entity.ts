import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DevelopmentPlanFeature } from 'src/modules/development/development-plan-features/entities/development-plan-feature.entity';

@Entity('plan_features')
export class PlanFeature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relationships
  @OneToMany(() => DevelopmentPlanFeature, dpf => dpf.feature)
  developmentPlanFeatures: DevelopmentPlanFeature[];
}