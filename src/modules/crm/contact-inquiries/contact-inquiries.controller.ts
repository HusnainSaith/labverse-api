import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContactInquiriesService } from './contact-inquiries.service';
import { CreateContactInquiryDto } from './dto/create-contact-inquiry.dto';
import { UpdateContactInquiryDto } from './dto/update-contact-inquiry.dto';

@Controller('contact-inquiries')
export class ContactInquiriesController {
  constructor(private readonly contactInquiriesService: ContactInquiriesService) {}

  @Post()
  create(@Body() createContactInquiryDto: CreateContactInquiryDto) {
    return this.contactInquiriesService.create(createContactInquiryDto);
  }

  @Get()
  findAll() {
    return this.contactInquiriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactInquiriesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactInquiryDto: UpdateContactInquiryDto) {
    return this.contactInquiriesService.update(id, updateContactInquiryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactInquiriesService.remove(id);
  }
}