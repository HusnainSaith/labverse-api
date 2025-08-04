import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(
    createTestimonialDto: CreateTestimonialDto,
  ): Promise<Testimonial> {
    const testimonial = this.testimonialRepository.create(createTestimonialDto);
    return await this.testimonialRepository.save(testimonial);
  }

  async findAll(): Promise<Testimonial[]> {
    return this.testimonialRepository.find();
  }

  async findOne(id: string): Promise<Testimonial> {
    const testimonial = await this.testimonialRepository.findOne({
      where: { id },
    });
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID "${id}" not found.`);
    }
    return testimonial;
  }

  async update(
    id: string,
    updateTestimonialDto: UpdateTestimonialDto,
  ): Promise<Testimonial> {
    await this.testimonialRepository.update(id, updateTestimonialDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.testimonialRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Testimonial with ID "${id}" not found.`);
    }
    return { message: 'Testimonial successfully deleted' };
  }
}
