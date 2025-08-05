import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from '../../../../src/modules/project-management/tasks/tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../../../../src/modules/project-management/tasks/entities/task.entity';
import { mockRepository } from '../../../utils/test-helpers';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: getRepositoryToken(Task), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        name: 'Test Task',
        description: 'Test Description',
        project_id: 'project-id',
        created_by_employee_profile_id: 'employee-id',
      };
      const mockTask = { id: 'task-id', ...createTaskDto };

      taskRepository.create.mockReturnValue(mockTask);
      taskRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto);

      expect(result).toEqual(mockTask);
      expect(taskRepository.create).toHaveBeenCalledWith({
        name: 'Test Task',
        description: 'Test Description',
        status: undefined,
        priority: undefined,
        due_date: undefined,
        project: { id: 'project-id' },
        project_milestone: undefined,
        created_by_employee_profile: { id: 'employee-id' },
        assigned_to_employee_profile: undefined,
      });
    });
  });
});