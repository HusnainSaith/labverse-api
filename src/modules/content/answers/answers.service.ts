import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}

  create(createAnswerDto: CreateAnswerDto) {
    const answer = this.answerRepository.create(createAnswerDto);
    return this.answerRepository.save(answer);
  }

  findAll() {
    return this.answerRepository.find({ relations: ['question'] });
  }

  findOne(id: string) {
    return this.answerRepository.findOne({
      where: { id },
      relations: ['question'],
    });
  }

  async update(id: string, updateAnswerDto: UpdateAnswerDto) {
    await this.answerRepository.update(id, updateAnswerDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.answerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Answer with ID "${id}" not found.`);
    }
    return { message: 'Answer successfully deleted' };
  }
}
