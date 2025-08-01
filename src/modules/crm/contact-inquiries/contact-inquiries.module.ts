import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactInquiriesService } from './contact-inquiries.service';
import { ContactInquiriesController } from './contact-inquiries.controller';
import { ContactInquiry } from './entities/contact-inquiry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactInquiry])],
  controllers: [ContactInquiriesController],
  providers: [ContactInquiriesService],
  exports: [ContactInquiriesService],
})
export class ContactInquiriesModule {}