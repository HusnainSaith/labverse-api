import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Invoice])],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [TypeOrmModule, PaymentsService],
})
export class PaymentsModule {}
