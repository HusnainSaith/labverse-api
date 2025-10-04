import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeSkill } from './entities/employee-skills.entity';
import { CreateEmployeeSkillDto } from './dto/create-employee-skill.dto';
import { UpdateEmployeeSkillDto } from './dto/update-employee-skill.dto';
import { EmployeeProfile } from '../employees/entities/employee.entity';
import { Skill } from '../skills/entities/skills.entity';
import { SecurityUtil } from '../../../common/utils/security.util';

@Injectable()
export class EmployeeSkillsService {
  constructor(
    @InjectRepository(EmployeeSkill)
    private readonly employeeSkillRepository: Repository<EmployeeSkill>,
    @InjectRepository(EmployeeProfile)
    private readonly employeeRepository: Repository<EmployeeProfile>,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async create(
    createEmployeeSkillDto: CreateEmployeeSkillDto,
  ): Promise<EmployeeSkill> {
    SecurityUtil.validateObject(createEmployeeSkillDto);
    const { employeeId, skillId } = createEmployeeSkillDto;

    const validEmployeeId = SecurityUtil.validateId(employeeId);
    const validSkillId = SecurityUtil.validateId(skillId);
    const employee = await this.employeeRepository.findOne({
      where: { userId: validEmployeeId },
    });
    if (!employee) {
      throw new NotFoundException(
        `Employee profile for user ID "${employeeId}" not found.`,
      );
    }

    const skill = await this.skillRepository.findOne({
      where: { id: validSkillId },
    });
    if (!skill) {
      throw new NotFoundException(`Skill with ID "${skillId}" not found.`);
    }

    const existingEmployeeSkill = await this.employeeSkillRepository.findOne({
      where: { employeeId: employee.id, skillId: validSkillId },
    });
    if (existingEmployeeSkill) {
      throw new ConflictException(`Employee already has this skill assigned.`);
    }

    console.log('Creating employee skill with:', {
      employeeId: employee.id,
      skillId,
      proficiencyLevel: createEmployeeSkillDto.proficiencyLevel,
      yearsOfExperience: createEmployeeSkillDto.yearsOfExperience,
    });

    const employeeSkill = this.employeeSkillRepository.create({
      employeeId: employee.id,
      skillId: validSkillId,
      proficiencyLevel: createEmployeeSkillDto.proficiencyLevel,
      yearsOfExperience: createEmployeeSkillDto.yearsOfExperience,
    });

    console.log('Created entity:', employeeSkill);
    return this.employeeSkillRepository.save(employeeSkill);
  }

  async findAll(): Promise<EmployeeSkill[]> {
    return this.employeeSkillRepository.find({
      relations: ['employee', 'skill'],
    });
  }
  async findByEmployee(employeeId: string): Promise<EmployeeSkill[]> {
    const validEmployeeId = SecurityUtil.validateId(employeeId);

    const employee = await this.employeeRepository.findOne({
      where: { id: validEmployeeId },
    });
    if (!employee) {
      throw new NotFoundException(
        `Employee profile with ID "${employeeId}" not found.`,
      );
    }

    return this.employeeSkillRepository.find({
      where: { employeeId: validEmployeeId },
      relations: ['skill'],
    });
  }

  async findOne(employeeId: string, skillId: string): Promise<EmployeeSkill> {
    const validEmployeeId = SecurityUtil.validateId(employeeId);
    const validSkillId = SecurityUtil.validateId(skillId);
    const employeeSkill = await this.employeeSkillRepository.findOne({
      where: { employeeId: validEmployeeId, skillId: validSkillId },
      relations: ['employee', 'skill'],
    });
    if (!employeeSkill) {
      throw new NotFoundException(`EmployeeSkill not found.`);
    }
    return employeeSkill;
  }

  async update(
    employeeId: string,
    skillId: string,
    updateEmployeeSkillDto: UpdateEmployeeSkillDto,
  ): Promise<EmployeeSkill> {
    SecurityUtil.validateObject(updateEmployeeSkillDto);
    const employeeSkill = await this.findOne(employeeId, skillId);
    Object.assign(employeeSkill, updateEmployeeSkillDto);
    return this.employeeSkillRepository.save(employeeSkill);
  }

  async remove(employeeId: string, skillId: string): Promise<void> {
    const validEmployeeId = SecurityUtil.validateId(employeeId);
    const validSkillId = SecurityUtil.validateId(skillId);
    const result = await this.employeeSkillRepository.delete({
      employeeId: validEmployeeId,
      skillId: validSkillId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`EmployeeSkill not found.`);
    }
  }
}
