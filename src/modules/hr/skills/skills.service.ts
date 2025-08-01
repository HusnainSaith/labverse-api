import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skills.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    const existingSkill = await this.skillRepository.findOne({ where: { name: createSkillDto.name } });
    if (existingSkill) {
      throw new ConflictException(`Skill with name "${createSkillDto.name}" already exists.`);
    }

    const skill = this.skillRepository.create(createSkillDto);
    return this.skillRepository.save(skill);
  }

  async findAll(): Promise<Skill[]> {
    return this.skillRepository.find();
  }

  async findOne(id: string): Promise<Skill> {
    const skill = await this.skillRepository.findOne({ where: { id } });
    if (!skill) {
      throw new NotFoundException(`Skill with ID "${id}" not found.`);
    }
    return skill;
  }

  async update(id: string, updateSkillDto: UpdateSkillDto): Promise<Skill> {
    const skill = await this.findOne(id);

    if (updateSkillDto.name && updateSkillDto.name !== skill.name) {
      const existingSkill = await this.skillRepository.findOne({ where: { name: updateSkillDto.name } });
      if (existingSkill && existingSkill.id !== id) {
        throw new ConflictException(`Skill with name "${updateSkillDto.name}" already exists.`);
      }
    }

    Object.assign(skill, updateSkillDto);
    return this.skillRepository.save(skill);
  }

  async remove(id: string): Promise<void> {
    const result = await this.skillRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Skill with ID "${id}" not found.`);
    }
  }
}