import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice } from './entities/invoice.entity';
// import { ClientsModule } from '../clients/clients.module'; // Assumed to exist
import { ProjectsModule } from '../../project-management/projects/projects.module';
import { ClientPlanQuotationsModule } from '../../client-plan-quotations/client-plan-quotations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    // ClientsModule,
    ProjectsModule,
    ClientPlanQuotationsModule,
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService, TypeOrmModule],
})
export class InvoicesModule {}
