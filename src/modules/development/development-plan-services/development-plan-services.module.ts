import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevelopmentPlanServicesService } from './development-plan-services.service';
import { DevelopmentPlanServicesController } from './development-plan-services.controller';
import { DevelopmentPlanService } from './entities/development-plan-service.entity';
import { DevelopmentPlansModule } from '../development-plans/development-plans.module';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DevelopmentPlanService]),
    DevelopmentPlansModule,
    ServicesModule,
  ],
  controllers: [DevelopmentPlanServicesController],
  providers: [DevelopmentPlanServicesService],
  exports: [DevelopmentPlanServicesService, TypeOrmModule],
})
export class DevelopmentPlanServicesModule {}
