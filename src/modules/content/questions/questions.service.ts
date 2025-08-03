import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  create(createQuestionDto: CreateQuestionDto) {
    const question = this.questionRepository.create(createQuestionDto);
    return this.questionRepository.save(question);
  }

  findAll() {
    return this.questionRepository.find({ relations: ['category'] });
  }

  findOne(id: string) {
    return this.questionRepository.findOne({ where: { id }, relations: ['category'] });
  }

  update(id: string, updateQuestionDto: UpdateQuestionDto) {
    return this.questionRepository.update(id, updateQuestionDto);
  }

  async remove(id: string) {
  const result = await this.questionRepository.delete(id);
  if (result.affected === 0) {
    throw new NotFoundException(`Question with ID "${id}" not found.`);
  }
  return { message: 'Question successfully deleted' };
}

}