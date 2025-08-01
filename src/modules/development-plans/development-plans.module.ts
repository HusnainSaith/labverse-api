import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevelopmentPlansService } from './development-plans.service';
import { DevelopmentPlansController } from './development-plans.controller';
import { DevelopmentPlan } from './entities/development-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DevelopmentPlan])],
  controllers: [DevelopmentPlansController],
  providers: [DevelopmentPlansService],
  exports: [DevelopmentPlansService, TypeOrmModule]
})
export class DevelopmentPlansModule {}