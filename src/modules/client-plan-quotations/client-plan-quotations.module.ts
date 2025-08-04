import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientPlanQuotationsService } from './client-plan-quotations.service';
import { ClientPlanQuotationsController } from './client-plan-quotations.controller';
import { ClientPlanQuotation } from './entities/client-plan-quotation.entity';
import { ClientsModule } from '../crm/clients/clients.module';
import { DevelopmentPlansModule } from '../development/development-plans/development-plans.module';
import { UsersModule } from '../users/users.module'; // Assuming you have a users module

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientPlanQuotation]),
    ClientsModule,
    DevelopmentPlansModule,
    UsersModule,
  ],
  controllers: [ClientPlanQuotationsController],
  providers: [ClientPlanQuotationsService],
  exports: [ClientPlanQuotationsService, TypeOrmModule],
})
export class ClientPlanQuotationsModule {}
