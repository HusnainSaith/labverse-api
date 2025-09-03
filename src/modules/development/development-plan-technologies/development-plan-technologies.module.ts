import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevelopmentPlanTechnologiesService } from './development-plan-technologies.service';
import { DevelopmentPlanTechnologiesController } from './development-plan-technologies.controller';
import { DevelopmentPlanTechnology } from './entities/development-plan-technology.entity';
import { DevelopmentPlansModule } from '../development-plans/development-plans.module';
import { TechnologiesModule } from "../../technology/technology.module"

@Module({
  imports: [
    TypeOrmModule.forFeature([DevelopmentPlanTechnology]),
    DevelopmentPlansModule, // So DPT can access DevelopmentPlan
    TechnologiesModule, // So DPT can access Technology
  ],
  controllers: [DevelopmentPlanTechnologiesController],
  providers: [DevelopmentPlanTechnologiesService],
  exports: [DevelopmentPlanTechnologiesService, TypeOrmModule],
})
export class DevelopmentPlanTechnologiesModule {}
