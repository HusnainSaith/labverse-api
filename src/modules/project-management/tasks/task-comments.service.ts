import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskComment } from './entities/task-comment.entity';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { UpdateTaskCommentDto } from './dto/update-task-comment.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class TaskCommentService {
  constructor(
    @InjectRepository(TaskComment)
    private readonly taskCommentRepo: Repository<TaskComment>,
  ) {}

  async create(dto: CreateTaskCommentDto) {
    // Task ID is typically required for a comment to make sense,
    // assuming 'task' relation is implicitly non-nullable in your DB schema.
    if (!dto.task_id) {
      throw new BadRequestException('Task ID is required to create a comment.');
    }
    // commented_by_employee_profile_id is now nullable according to your entity,
    // so no check is needed here. If it's not provided, it will be null.

    const comment = this.taskCommentRepo.create({
      comment_text: dto.comment_text,
      task: { id: dto.task_id },
      // Conditionally set commented_by_employee_profile based on DTO.
      // If dto.commented_by_employee_profile_id is provided, use it, otherwise it will be null.
      commented_by_employee_profile: dto.commented_by_employee_profile_id
        ? { id: dto.commented_by_employee_profile_id }
        : null, // Explicitly set to null if not provided, aligning with nullable: true
    });

    return this.taskCommentRepo.save(comment);
  }

  async findAll() {
    return this.taskCommentRepo.find({
      relations: ['task', 'commented_by_employee_profile'],
    });
  }

  async findOne(id: string) {
    const comment = await this.taskCommentRepo.findOne({
      where: { id },
      relations: ['task', 'commented_by_employee_profile'],
    });

    if (!comment) {
      throw new NotFoundException(`Task comment with ID ${id} not found`);
    }

    return comment;
  }

  async update(id: string, dto: UpdateTaskCommentDto) {
    await this.findOne(id); // ensure it exists

    const updateData: QueryDeepPartialEntity<TaskComment> = {};

    // Only include comment_text if it's explicitly provided in the DTO
    if (dto.comment_text !== undefined) {
      updateData.comment_text = dto.comment_text;
    }

    // Handle task_id update:
    // Check if task_id is present in the DTO (meaning it was sent in the request body).
    if (dto.task_id !== undefined) {
      // If task_id is explicitly null, throw an error if the 'task' relation is non-nullable.
      // This prevents 'null value violates not-null constraint' errors at the database level.
      if (dto.task_id === null) {
        throw new BadRequestException('Task ID cannot be null for updating a comment as it is a required field.');
      }
      // If task_id is present and not null, set the task relation by its ID.
      updateData.task = { id: dto.task_id };
    }

    // Handle commented_by_employee_profile_id update:
    // Check if commented_by_employee_profile_id is present in the DTO.
    // Since 'commented_by_employee_profile' is nullable, it's permissible to set it to null.
    if (dto.commented_by_employee_profile_id !== undefined) {
      updateData.commented_by_employee_profile = dto.commented_by_employee_profile_id
        ? { id: dto.commented_by_employee_profile_id }
        : null; // Allow setting the relation to null
    }

    await this.taskCommentRepo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string) {
    const comment = await this.findOne(id);
    return this.taskCommentRepo.remove(comment);
  }
}
