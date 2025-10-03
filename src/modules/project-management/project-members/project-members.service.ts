import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectMember } from './entities/project-member.entity';
import { CreateProjectMemberDto } from './dto/create-project-member.dto';

@Injectable()
export class ProjectMembersService {
  constructor(
    @InjectRepository(ProjectMember)
    private readonly projectMemberRepository: Repository<ProjectMember>,
  ) {}

  async create(dto: CreateProjectMemberDto): Promise<ProjectMember> {
    const member = this.projectMemberRepository.create(dto);
    return await this.projectMemberRepository.save(member);
  }

  async findAll(): Promise<ProjectMember[]> {
    return await this.projectMemberRepository.find({
      relations: ['project', 'employee'],
    });
  }

  async findOne(id: string): Promise<ProjectMember> {
    const member = await this.projectMemberRepository.findOne({
      where: { id },
      relations: ['project', 'employee'],
    });
    if (!member)
      throw new NotFoundException(`ProjectMember with ID ${id} not found`);
    return member;
  }

  async update(
    id: string,
    dto: Partial<CreateProjectMemberDto>,
  ): Promise<ProjectMember> {
    const member = await this.findOne(id);
    Object.assign(member, dto);
    return await this.projectMemberRepository.save(member);
  }

  async remove(id: string): Promise<void> {
    const member = await this.findOne(id);
    await this.projectMemberRepository.remove(member);
  }
}
