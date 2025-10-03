import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ContactInquiriesService } from './contact-inquiries.service';
import { CreateContactInquiryDto } from './dto/create-contact-inquiry.dto';
import { UpdateContactInquiryDto } from './dto/update-contact-inquiry.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Contact Inquiries')
@Controller('contact-inquiries')
export class ContactInquiriesController {
  constructor(
    private readonly contactInquiriesService: ContactInquiriesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new client plan quotation' })
  create(@Body() createContactInquiryDto: CreateContactInquiryDto) {
    return this.contactInquiriesService.create(createContactInquiryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all client plan quotations' })
  findAll() {
    return this.contactInquiriesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve a client plan quotation by ID' })
  findOne(@Param('id') id: string) {
    return this.contactInquiriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a client plan quotation by ID' })
  update(
    @Param('id') id: string,
    @Body() updateContactInquiryDto: UpdateContactInquiryDto,
  ) {
    return this.contactInquiriesService.update(id, updateContactInquiryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a client plan quotation by ID' })
  remove(@Param('id') id: string) {
    return this.contactInquiriesService.remove(id);
  }
}
