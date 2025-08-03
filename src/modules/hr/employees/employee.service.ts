import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeProfile } from './entities/employee.entity';
import { CreateEmployeeProfileDto } from './dto/create-employee.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee.dto';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class EmployeeProfilesService {
  constructor(
    @InjectRepository(EmployeeProfile)
    private readonly employeeProfileRepository: Repository<EmployeeProfile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createEmployeeProfileDto: CreateEmployeeProfileDto): Promise<EmployeeProfile> {
    const { userId, employeeCode } = createEmployeeProfileDto;

    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }

    // Check if an employee profile already exists for this user
    const existingProfileByUser = await this.employeeProfileRepository.findOne({ where: { userId } });
    if (existingProfileByUser) {
      throw new ConflictException(`Employee profile already exists for user with ID "${userId}".`);
    }

    // Check if employee code is unique
    const existingProfileByCode = await this.employeeProfileRepository.findOne({ where: { employeeCode } });
    if (existingProfileByCode) {
      throw new ConflictException(`Employee profile with code "${employeeCode}" already exists.`);
    }

    const employeeProfile = this.employeeProfileRepository.create(createEmployeeProfileDto);
    return this.employeeProfileRepository.save(employeeProfile);
  }

  async findAll(): Promise<EmployeeProfile[]> {
    return this.employeeProfileRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<EmployeeProfile> {
    const employeeProfile = await this.employeeProfileRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!employeeProfile) {
      throw new NotFoundException('ID is not match or found');
    }
    return employeeProfile;
  }

  async update(id: string, updateEmployeeProfileDto: UpdateEmployeeProfileDto): Promise<EmployeeProfile> {
    const employeeProfile = await this.findOne(id); // Reuses findOne to check existence

    if (updateEmployeeProfileDto.userId && updateEmployeeProfileDto.userId !== employeeProfile.userId) {
      // If userId is being changed, ensure the new userId exists and doesn't already have a profile
      const newUser = await this.userRepository.findOne({ where: { id: updateEmployeeProfileDto.userId } });
      if (!newUser) {
        throw new NotFoundException(`User with ID "${updateEmployeeProfileDto.userId}" not found.`);
      }
      const existingProfileForNewUser = await this.employeeProfileRepository.findOne({ where: { userId: updateEmployeeProfileDto.userId } });
      if (existingProfileForNewUser && existingProfileForNewUser.id !== id) {
        throw new ConflictException(`Employee profile already exists for user with ID "${updateEmployeeProfileDto.userId}".`);
      }
    }

    if (updateEmployeeProfileDto.employeeCode && updateEmployeeProfileDto.employeeCode !== employeeProfile.employeeCode) {
      // Check if the new employeeCode is unique
      const existingProfileByCode = await this.employeeProfileRepository.findOne({ where: { employeeCode: updateEmployeeProfileDto.employeeCode } });
      if (existingProfileByCode && existingProfileByCode.id !== id) {
        throw new ConflictException(`Employee profile with code "${updateEmployeeProfileDto.employeeCode}" already exists.`);
      }
    }

    Object.assign(employeeProfile, updateEmployeeProfileDto);
    return this.employeeProfileRepository.save(employeeProfile);
  }

  async remove(id: string): Promise<void> {
    const result = await this.employeeProfileRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('ID is not match or found');
    }
  }
}
