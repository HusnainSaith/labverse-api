import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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

  async create(createContactInquiryDto: CreateContactInquiryDto): Promise<ContactInquiry> {
    try {
      const inquiry = this.contactInquiryRepository.create(createContactInquiryDto);
      return await this.contactInquiryRepository.save(inquiry);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Contact inquiry with this email already exists.');
      }
      throw error;
    }
  }

  async findAll(): Promise<ContactInquiry[]> {
    return this.contactInquiryRepository.find();
  }

  async findOne(id: string): Promise<ContactInquiry> {
    const inquiry = await this.contactInquiryRepository.findOne({ where: { id } });
    if (!inquiry) {
      throw new NotFoundException(`Contact inquiry with ID "${id}" not found.`);
    }
    return inquiry;
  }

  async update(id: string, updateContactInquiryDto: UpdateContactInquiryDto): Promise<ContactInquiry> {
    try {
      await this.contactInquiryRepository.update(id, updateContactInquiryDto);
      return this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '23505') {
        throw new ConflictException('Contact inquiry with this email already exists.');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.contactInquiryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Contact inquiry with ID "${id}" not found.`);
    }
    return { message: 'Contact inquiry successfully deleted' };
  }
}
