import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeProfilesService } from '../../../../src/modules/hr/employees/employee.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmployeeProfile } from '../../../../src/modules/hr/employees/entities/employee.entity';
import { User } from '../../../../src/modules/users/entities/user.entity';
import { mockRepository } from '../../../utils/test-helpers';

describe('EmployeeProfilesService', () => {
  let service: EmployeeProfilesService;
  let employeeRepository: any;
  let userRepository: any;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        EmployeeProfilesService,
        {
          provide: getRepositoryToken(EmployeeProfile),
          useValue: mockRepository(),
        },
        { provide: getRepositoryToken(User), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<EmployeeProfilesService>(EmployeeProfilesService);
    employeeRepository = module.get(getRepositoryToken(EmployeeProfile));
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      const createEmployeeDto = {
        userId: 'user-id',
        employeeCode: 'EMP001',
        jobTitle: 'Developer',
        department: 'Engineering',
      };
      const mockEmployee = { id: 'employee-id', ...createEmployeeDto };
      const mockUser = { id: 'user-id' };

      userRepository.findOne.mockResolvedValue(mockUser);
      employeeRepository.findOne.mockResolvedValue(null); // No existing profile
      employeeRepository.create.mockReturnValue(mockEmployee);
      employeeRepository.save.mockResolvedValue(mockEmployee);

      const result = await service.create(createEmployeeDto);

      expect(result).toEqual(mockEmployee);
      expect(employeeRepository.create).toHaveBeenCalledWith(createEmployeeDto);
    });
  });

  describe('findAll', () => {
    it('should return array of employees', async () => {
      const mockEmployees = [{ id: 'employee-id', position: 'Developer' }];
      employeeRepository.find.mockResolvedValue(mockEmployees);

      const result = await service.findAll();

      expect(result).toEqual(mockEmployees);
      expect(employeeRepository.find).toHaveBeenCalled();
    });
  });
});
