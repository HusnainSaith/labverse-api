import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskComment } from './entities/task-comment.entity';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { UpdateTaskCommentDto } from './dto/update-task-comment.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { SecurityUtil } from '../../../common/utils/security.util';

@Injectable()
export class TaskCommentService {
  constructor(
    @InjectRepository(TaskComment)
    private readonly taskCommentRepo: Repository<TaskComment>,
  ) {}

  async create(dto: CreateTaskCommentDto) {
    SecurityUtil.validateObject(dto);
    // Task ID is typically required for a comment to make sense,
    // assuming 'task' relation is implicitly non-nullable in your DB schema.
    if (!dto.task_id) {
      throw new BadRequestException('Task ID is required to create a comment.');
    }
    const validTaskId = SecurityUtil.validateId(dto.task_id);
    // commented_by_employee_profile_id is now nullable according to your entity,
    // so no check is needed here. If it's not provided, it will be null.

    const comment = this.taskCommentRepo.create({
      comment_text: dto.comment_text,
      task: { id: validTaskId },
      // Conditionally set commented_by_employee_profile based on DTO.
      // If dto.commented_by_employee_profile_id is provided, use it, otherwise it will be null.
      commented_by_employee_profile: dto.commented_by_employee_profile_id
        ? { id: SecurityUtil.validateId(dto.commented_by_employee_profile_id) }
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
    const validId = SecurityUtil.validateId(id);
    const comment = await this.taskCommentRepo.findOne({
      where: { id: validId },
      relations: ['task', 'commented_by_employee_profile'],
    });

    if (!comment) {
      throw new NotFoundException(`Task comment with ID ${validId} not found`);
    }

    return comment;
  }

  async update(id: string, dto: UpdateTaskCommentDto) {
    SecurityUtil.validateObject(dto);
    const validId = SecurityUtil.validateId(id);
    await this.findOne(validId); // ensure it exists

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
        throw new BadRequestException(
          'Task ID cannot be null for updating a comment as it is a required field.',
        );
      }
      // If task_id is present and not null, set the task relation by its ID.
      const validTaskId = SecurityUtil.validateId(dto.task_id);
      updateData.task = { id: validTaskId };
    }

    // Handle commented_by_employee_profile_id update:
    // Check if commented_by_employee_profile_id is present in the DTO.
    // Since 'commented_by_employee_profile' is nullable, it's permissible to set it to null.
    if (dto.commented_by_employee_profile_id !== undefined) {
      updateData.commented_by_employee_profile =
        dto.commented_by_employee_profile_id
          ? {
              id: SecurityUtil.validateId(dto.commented_by_employee_profile_id),
            }
          : null; // Allow setting the relation to null
    }

    await this.taskCommentRepo.update(validId, updateData);
    return this.findOne(validId);
  }

  async remove(id: string) {
    const comment = await this.findOne(id);
    return this.taskCommentRepo.remove(comment);
  }
}
