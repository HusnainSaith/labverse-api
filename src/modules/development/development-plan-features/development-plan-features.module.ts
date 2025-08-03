import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevelopmentPlanFeaturesService } from './development-plan-features.service';
import { DevelopmentPlanFeaturesController } from './development-plan-features.controller';
import { DevelopmentPlanFeature } from './entities/development-plan-feature.entity';
import { DevelopmentPlansModule } from '../development-plans/development-plans.module'; // Import to use DevelopmentPlan entity
import { PlanFeaturesModule } from 'src/modules/plan-features/plan-features.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DevelopmentPlanFeature]),
    DevelopmentPlansModule, // So DPF can access DevelopmentPlan
    PlanFeaturesModule,     // So DPF can access PlanFeature
  ],
  controllers: [DevelopmentPlanFeaturesController],
  providers: [DevelopmentPlanFeaturesService],
  exports: [DevelopmentPlanFeaturesService, TypeOrmModule]
})
export class DevelopmentPlanFeaturesModule {}