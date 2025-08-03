import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeEntry } from './entities/time-entry.entity';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { EmployeeProfile } from '../../hr/employees/entities/employee.entity';
import { Project } from '../projects/entities/projects.entity';
import { Task } from '../tasks/entities/task.entity';

@Injectable()
export class TimeEntriesService {
  constructor(
    @InjectRepository(TimeEntry)
    private timeEntryRepository: Repository<TimeEntry>,
    @InjectRepository(EmployeeProfile)
    private employeeRepository: Repository<EmployeeProfile>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTimeEntryDto: CreateTimeEntryDto): Promise<TimeEntry> {
    try {
      const { employeeId, projectId, taskId } = createTimeEntryDto;

      // Validate employee exists
      if (employeeId) {
        const employee = await this.employeeRepository.findOne({ where: { id: employeeId } });
        if (!employee) {
          throw new NotFoundException(`Employee with ID "${employeeId}" not found.`);
        }
      }

      // Validate project exists
      if (projectId) {
        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
          throw new NotFoundException(`Project with ID "${projectId}" not found.`);
        }
      }

      // Validate task exists
      if (taskId) {
        const task = await this.taskRepository.findOne({ where: { id: taskId } });
        if (!task) {
          throw new NotFoundException(`Task with ID "${taskId}" not found.`);
        }
      }

      const timeEntry = this.timeEntryRepository.create(createTimeEntryDto);
      return await this.timeEntryRepository.save(timeEntry);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '23503') {
        throw new NotFoundException('Referenced employee, project, or task not found.');
      }
      throw error;
    }
  }

  async findAll(): Promise<TimeEntry[]> {
    return this.timeEntryRepository.find({
      relations: ['employee', 'project', 'task']
    });
  }

  async findByEmployee(employeeId: string): Promise<TimeEntry[]> {
    return this.timeEntryRepository.find({
      where: { employeeId },
      relations: ['project', 'task']
    });
  }

  async findByProject(projectId: string): Promise<TimeEntry[]> {
    return this.timeEntryRepository.find({
      where: { projectId },
      relations: ['employee', 'task']
    });
  }

  async findOne(id: string): Promise<TimeEntry> {
    const timeEntry = await this.timeEntryRepository.findOne({
      where: { id },
      relations: ['employee', 'project', 'task']
    });
    if (!timeEntry) {
      throw new NotFoundException(`Time entry with ID "${id}" not found.`);
    }
    return timeEntry;
  }

  async update(id: string, updateTimeEntryDto: UpdateTimeEntryDto): Promise<TimeEntry> {
    try {
      // Validate references if they're being updated
      if (updateTimeEntryDto.employeeId) {
        const employee = await this.employeeRepository.findOne({ where: { id: updateTimeEntryDto.employeeId } });
        if (!employee) {
          throw new NotFoundException(`Employee with ID "${updateTimeEntryDto.employeeId}" not found.`);
        }
      }

      if (updateTimeEntryDto.projectId) {
        const project = await this.projectRepository.findOne({ where: { id: updateTimeEntryDto.projectId } });
        if (!project) {
          throw new NotFoundException(`Project with ID "${updateTimeEntryDto.projectId}" not found.`);
        }
      }

      if (updateTimeEntryDto.taskId) {
        const task = await this.taskRepository.findOne({ where: { id: updateTimeEntryDto.taskId } });
        if (!task) {
          throw new NotFoundException(`Task with ID "${updateTimeEntryDto.taskId}" not found.`);
        }
      }

      await this.timeEntryRepository.update(id, updateTimeEntryDto);
      return this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '23503') {
        throw new NotFoundException('Referenced employee, project, or task not found.');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.timeEntryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Time entry with ID "${id}" not found.`);
    }
    return { message: 'Time entry successfully deleted' };
  }
}