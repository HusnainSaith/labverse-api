import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DevelopmentPlanFeature } from '../../development-plan-features/entities/development-plan-feature.entity';
import { DevelopmentPlanService } from '../../development-plan-services/entities/development-plan-service.entity';
import { DevelopmentPlanTechnology } from '../../development-plan-technologies/entities/development-plan-technology.entity';
import { ClientPlanQuotation } from '../../../client-plan-quotations/entities/client-plan-quotation.entity';

@Entity('development_plans')
export class DevelopmentPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // Relationships
  @OneToMany(() => DevelopmentPlanFeature, (dpf) => dpf.plan)
  developmentPlanFeatures: DevelopmentPlanFeature[];

  @OneToMany(() => DevelopmentPlanService, (dps) => dps.plan)
  developmentPlanServices: DevelopmentPlanService[];

  @OneToMany(() => DevelopmentPlanTechnology, (dpt) => dpt.plan)
  developmentPlanTechnologies: DevelopmentPlanTechnology[];

  @OneToMany(() => ClientPlanQuotation, (quotation) => quotation.plan)
  clientPlanQuotations: ClientPlanQuotation[];
}
