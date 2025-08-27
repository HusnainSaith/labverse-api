import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeProfile } from './entities/employee.entity';
import { CreateEmployeeProfileDto } from './dto/create-employee.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee.dto';
import { User } from '../../users/entities/user.entity';
import { SafeLogger } from '../../../common/utils/logger.util';


export interface ServiceResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
}

@Injectable()
export class EmployeeProfilesService {
  constructor(
    @InjectRepository(EmployeeProfile)
    private readonly employeeProfileRepository: Repository<EmployeeProfile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

 
  
async create(
  createEmployeeProfileDto: CreateEmployeeProfileDto,
): Promise<ServiceResponse<EmployeeProfile>> {
  try {
    const { userId, employeeCode } = createEmployeeProfileDto;

    // 1. Check if user exists
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['role'] // Include role relation to check user's role
    });
    
    if (!user) {
      throw new NotFoundException('User not found for the provided userId');
    }

    // 2. Check if user has employee role
    if (!user.role || user.role.name.toLowerCase() !== 'employee') {
      throw new ForbiddenException('User is not an employee. Only users with employee role can have employee profiles.');
    }

    // 3. Business Logic Validation (Uniqueness constraints):
    const existingProfileByUser = await this.employeeProfileRepository.findOne({
      where: { userId },
    });
    if (existingProfileByUser) {
      throw new ConflictException('Employee profile already exists for this user');
    }

    const existingProfileByCode = await this.employeeProfileRepository.findOne({
      where: { employeeCode }, 
    });
    if (existingProfileByCode) {
      throw new ConflictException('Employee profile with this code already exists');
    }

    // 4. Operation:
    const employeeProfile = this.employeeProfileRepository.create({
      ...createEmployeeProfileDto,
    });

    const savedProfile = await this.employeeProfileRepository.save(employeeProfile);
    SafeLogger.log(`Employee profile created: ${employeeCode} for user ${userId}`, 'EmployeeProfilesService');

    return {
      success: true,
      message: 'Employee profile created successfully',
      data: savedProfile,
      statusCode: HttpStatus.CREATED,
    };
  } catch (error) {
    this.handleServiceError(error, 'Failed to create employee profile');
  }
}

  async findAll(): Promise<ServiceResponse<EmployeeProfile[]>> {
    try {
      const profiles = await this.employeeProfileRepository.find({ relations: ['user'] });
      SafeLogger.log(`Retrieved ${profiles.length} employee profiles`, 'EmployeeProfilesService');
      return {
        success: true,
        message: 'Employee profiles retrieved successfully',
        data: profiles,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.handleServiceError(error, 'Failed to retrieve employee profiles');
    }
  }
  async findOne(id: string): Promise<ServiceResponse<EmployeeProfile>> {
    try {
      // Input Validation (UUID format) is handled by DTO/pipe or route parameter validation.
      const employeeProfile = await this.employeeProfileRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!employeeProfile) {
        SafeLogger.warn(`Attempted to find non-existent employee profile: ${id}`, 'EmployeeProfilesService');
        throw new NotFoundException(`Employee profile with ID "${id}" not found`);
      }

      return {
        success: true,
        message: 'Employee profile retrieved successfully',
        data: employeeProfile,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.handleServiceError(error, `Failed to retrieve employee profile ${id}`);
    }
  }

  async update(
    id: string,
    updateEmployeeProfileDto: UpdateEmployeeProfileDto,
  ): Promise<ServiceResponse<EmployeeProfile>> {
    try {
      
      const employeeProfile = await this.employeeProfileRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!employeeProfile) {
        throw new NotFoundException(`Employee profile with ID "${id}" not found`);
      }

      
      if (
        updateEmployeeProfileDto.userId &&
        updateEmployeeProfileDto.userId !== employeeProfile.userId
      ) {
        const newUser = await this.userRepository.findOne({
          where: { id: updateEmployeeProfileDto.userId },
        });
        if (!newUser) {
          throw new NotFoundException('New user not found for the provided userId');
        }
        const existingProfileForNewUser = await this.employeeProfileRepository.findOne({
          where: { userId: updateEmployeeProfileDto.userId },
        });
        if (existingProfileForNewUser && existingProfileForNewUser.id !== id) {
          throw new ConflictException('Employee profile already exists for the new user');
        }
      }

    
      if (
        updateEmployeeProfileDto.employeeCode &&
        updateEmployeeProfileDto.employeeCode !== employeeProfile.employeeCode
      ) {
        const existingProfileByCode = await this.employeeProfileRepository.findOne({
          where: { employeeCode: updateEmployeeProfileDto.employeeCode }, 
        });
        if (existingProfileByCode && existingProfileByCode.id !== id) {
          throw new ConflictException('Employee profile with this code already exists');
        }
      }

    
      Object.assign(employeeProfile, updateEmployeeProfileDto);
      const updatedProfile = await this.employeeProfileRepository.save(employeeProfile);

      SafeLogger.log(`Employee profile updated: ${id}`, 'EmployeeProfilesService');
      return {
        success: true,
        message: 'Employee profile updated successfully',
        data: updatedProfile,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.handleServiceError(error, `Failed to update employee profile ${id}`);
    }
  }

  
  async remove(id: string): Promise<ServiceResponse> {
    try {
      // Input Validation (UUID format) is handled by DTO/pipe or route parameter validation.
      const result = await this.employeeProfileRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Employee profile with ID "${id}" not found`);
      }

      SafeLogger.log(`Employee profile deleted: ${id}`, 'EmployeeProfilesService');
      return {
        success: true,
        message: 'Employee profile deleted successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.handleServiceError(error, `Failed to delete employee profile ${id}`);
    }
  }

  private handleServiceError(error: any, context: string): never {
    SafeLogger.error(`${context}: ${error.message}`, 'EmployeeProfilesService', error.stack);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new InternalServerErrorException(`${context}. Please try again later.`);
  }
}
