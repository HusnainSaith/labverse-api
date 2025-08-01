import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactInquiry } from './entities/contact-inquiry.entity';
import { CreateContactInquiryDto } from './dto/create-contact-inquiry.dto';
import { UpdateContactInquiryDto } from './dto/update-contact-inquiry.dto';

@Injectable()
export class ContactInquiriesService {
  constructor(
    @InjectRepository(ContactInquiry)
    private contactInquiryRepository: Repository<ContactInquiry>,
  ) {}

  create(createContactInquiryDto: CreateContactInquiryDto) {
    const inquiry = this.contactInquiryRepository.create(createContactInquiryDto);
    return this.contactInquiryRepository.save(inquiry);
  }

  findAll() {
    return this.contactInquiryRepository.find();
  }

  findOne(id: string) {
    return this.contactInquiryRepository.findOne({ where: { id } });
  }

  update(id: string, updateContactInquiryDto: UpdateContactInquiryDto) {
    return this.contactInquiryRepository.update(id, updateContactInquiryDto);
  }

  remove(id: string) {
    return this.contactInquiryRepository.delete(id);
  }
}