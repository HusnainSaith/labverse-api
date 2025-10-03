import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SecurityUtil } from '../../../common/utils/security.util';
import { ValidationUtil } from '../../../common/utils/validation.util';
import { SafeLogger } from '../../../common/utils/logger.util';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
  ) {}

  async create(
    dto: CreateTaskDto,
  ): Promise<{ success: boolean; message: string; data: Task }> {
    ValidationUtil.validateString(dto.name, 'name', 2, 200);
    if (dto.description) {
      ValidationUtil.validateString(dto.description, 'description', 0, 1000);
    }
    if (dto.status) {
      ValidationUtil.validateString(dto.status, 'status', 1, 50);
    }
    if (dto.priority) {
      ValidationUtil.validateString(dto.priority, 'priority', 1, 50);
    }
    if (dto.due_date) {
      ValidationUtil.validateDate(dto.due_date, 'due_date');
    }
    ValidationUtil.validateUUID(dto.project_id, 'project_id');
    if (dto.project_milestone_id) {
      ValidationUtil.validateUUID(
        dto.project_milestone_id,
        'project_milestone_id',
      );
    }
    if (dto.created_by_employee_profile_id) {
      ValidationUtil.validateUUID(
        dto.created_by_employee_profile_id,
        'created_by_employee_profile_id',
      );
    }
    if (dto.assigned_to_employee_profile_id) {
      ValidationUtil.validateUUID(
        dto.assigned_to_employee_profile_id,
        'assigned_to_employee_profile_id',
      );
    }

    const task = this.taskRepo.create({
      name: ValidationUtil.sanitizeString(dto.name),
      description: dto.description
        ? ValidationUtil.sanitizeString(dto.description)
        : undefined,
      status: dto.status,
      priority: dto.priority,
      due_date: dto.due_date,
      project: { id: dto.project_id },
      project_milestone: dto.project_milestone_id
        ? { id: dto.project_milestone_id }
        : undefined,
      created_by_employee_profile: dto.created_by_employee_profile_id
        ? { id: dto.created_by_employee_profile_id }
        : undefined,
      assigned_to_employee_profile: dto.assigned_to_employee_profile_id
        ? { id: dto.assigned_to_employee_profile_id }
        : undefined,
    });

    const savedTask = await this.taskRepo.save(task);

    SafeLogger.log(`Task created successfully: ${dto.name}`, 'TaskService');
    return {
      success: true,
      message: 'Task created successfully',
      data: savedTask,
    };
  }

  async findAll(): Promise<{
    success: boolean;
    message: string;
    data: Task[];
  }> {
    const tasks = await this.taskRepo.find({
      relations: [
        'project',
        'project_milestone',
        'assigned_to_employee_profile',
      ],
    });

    return {
      success: true,
      message: 'Tasks retrieved successfully',
      data: tasks,
    };
  }

  async findOne(
    id: string,
  ): Promise<{ success: boolean; message: string; data: Task }> {
    ValidationUtil.validateUUID(id, 'taskId');

    const task = await this.taskRepo.findOne({
      where: { id },
      relations: [
        'project',
        'project_milestone',
        'assigned_to_employee_profile',
      ],
    });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return {
      success: true,
      message: 'Task retrieved successfully',
      data: task,
    };
  }

  async update(
    id: string,
    dto: UpdateTaskDto,
  ): Promise<{ success: boolean; message: string; data: Task }> {
    ValidationUtil.validateUUID(id, 'taskId');

    if (dto.name) {
      ValidationUtil.validateString(dto.name, 'name', 2, 200);
    }
    if (dto.description !== undefined) {
      if (dto.description) {
        ValidationUtil.validateString(dto.description, 'description', 0, 1000);
      }
    }
    if (dto.status) {
      ValidationUtil.validateString(dto.status, 'status', 1, 50);
    }
    if (dto.priority) {
      ValidationUtil.validateString(dto.priority, 'priority', 1, 50);
    }
    if (dto.due_date) {
      ValidationUtil.validateDate(dto.due_date, 'due_date');
    }
    if (dto.project_id) {
      ValidationUtil.validateUUID(dto.project_id, 'project_id');
    }
    if (dto.project_milestone_id) {
      ValidationUtil.validateUUID(
        dto.project_milestone_id,
        'project_milestone_id',
      );
    }
    if (dto.created_by_employee_profile_id) {
      ValidationUtil.validateUUID(
        dto.created_by_employee_profile_id,
        'created_by_employee_profile_id',
      );
    }
    if (dto.assigned_to_employee_profile_id) {
      ValidationUtil.validateUUID(
        dto.assigned_to_employee_profile_id,
        'assigned_to_employee_profile_id',
      );
    }

    const taskResult = await this.findOne(id);
    const task = taskResult.data;

    // Update scalar fields
    task.name = dto.name ? ValidationUtil.sanitizeString(dto.name) : task.name;
    task.description =
      dto.description !== undefined
        ? dto.description
          ? ValidationUtil.sanitizeString(dto.description)
          : null
        : task.description;
    task.status = dto.status ?? task.status;
    task.priority = dto.priority ?? task.priority;
    task.due_date = dto.due_date ?? task.due_date;

    // Update relation fields conditionally
    if (dto.project_id) {
      task.project = { id: dto.project_id } as any;
    }

    if (dto.project_milestone_id !== undefined) {
      task.project_milestone = dto.project_milestone_id
        ? ({ id: dto.project_milestone_id } as any)
        : null;
    }

    if (dto.created_by_employee_profile_id !== undefined) {
      task.created_by_employee_profile = dto.created_by_employee_profile_id
        ? ({ id: dto.created_by_employee_profile_id } as any)
        : null;
    }

    if (dto.assigned_to_employee_profile_id !== undefined) {
      task.assigned_to_employee_profile = dto.assigned_to_employee_profile_id
        ? ({ id: dto.assigned_to_employee_profile_id } as any)
        : null;
    }

    const updatedTask = await this.taskRepo.save(task);

    SafeLogger.log(`Task updated successfully: ${id}`, 'TaskService');
    return {
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    };
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    ValidationUtil.validateUUID(id, 'taskId');

    const taskResult = await this.findOne(id);
    const task = taskResult.data;
    await this.taskRepo.remove(task);

    SafeLogger.log(`Task deleted successfully: ${id}`, 'TaskService');
    return {
      success: true,
      message: 'Task deleted successfully',
    };
  }
}
