import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientPlanQuotationsService } from './client-plan-quotations.service';
import { ClientPlanQuotationsController } from './client-plan-quotations.controller';
import { ClientPlanQuotation } from './entities/client-plan-quotation.entity';
// import { ClientsModule } from '../clients/clients.module'; // Assuming you have a clients module
import { DevelopmentPlansModule } from '../development-plans/development-plans.module';
import { UsersModule } from '../users/users.module'; // Assuming you have a users module

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientPlanQuotation]),
    // ClientsModule,
    DevelopmentPlansModule,
    UsersModule,
  ],
  controllers: [ClientPlanQuotationsController],
  providers: [ClientPlanQuotationsService],
  exports: [ClientPlanQuotationsService, TypeOrmModule]
})
export class ClientPlanQuotationsModule {}