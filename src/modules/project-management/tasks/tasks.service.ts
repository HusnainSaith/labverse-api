import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto) {
    const task = this.taskRepo.create({
      name: dto.name,
      description: dto.description,
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

    return this.taskRepo.save(task);
  }

  async findAll() {
    return this.taskRepo.find({
      relations: ['project', 'project_milestone', 'assigned_to_employee_profile'],
    });
  }

  async findOne(id: string) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['project', 'project_milestone', 'assigned_to_employee_profile'],
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
  const task = await this.findOne(id); // Fetch current task or throw

  // Update scalar fields
  task.name = dto.name ?? task.name;
  task.description = dto.description ?? task.description;
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

  await this.taskRepo.save(task);
  return this.findOne(id);
}


  async remove(id: string) {
    const task = await this.findOne(id);
    return this.taskRepo.remove(task);
  }
}
