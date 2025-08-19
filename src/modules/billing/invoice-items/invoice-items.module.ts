import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceItem } from './entities/invoice-item.entity';
import { InvoiceItemsService } from './invoice-items.service';
import { InvoiceItemsController } from './invoice-items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceItem])],
  providers: [InvoiceItemsService],
  controllers: [InvoiceItemsController],
  exports: [TypeOrmModule, InvoiceItemsService],
})
export class InvoiceItemsModule {}
