import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial)
    private testimonialRepository: Repository<Testimonial>,
  ) {}

  create(createTestimonialDto: CreateTestimonialDto) {
    const testimonial = this.testimonialRepository.create(createTestimonialDto);
    return this.testimonialRepository.save(testimonial);
  }

  findAll() {
    return this.testimonialRepository.find();
  }

  findOne(id: string) {
    return this.testimonialRepository.findOne({ where: { id } });
  }

  update(id: string, updateTestimonialDto: UpdateTestimonialDto) {
    return this.testimonialRepository.update(id, updateTestimonialDto);
  }

  remove(id: string) {
    return this.testimonialRepository.delete(id);
  }
}