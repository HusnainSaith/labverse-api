import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeProfilesController } from '../../../modules/employees/employee.controller';
import { EmployeeProfilesService } from '../../../modules/employees/employee.service';
import { CreateEmployeeProfileDto } from '../../../modules/employees/dto/create-employee.dto';
import { UpdateEmployeeProfileDto } from '../../../modules/employees/dto/update-employee.dto';
import { EmployeeProfile } from '../../../modules/employees/entities/employee.entity'; // Corrected import name
import { JwtAuthGuard } from '../../../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { EmployeeStatus } from '../../../modules/employees/dto/employee-status.enum'; // Assuming this path

describe('EmployeeProfilesController', () => {
  let controller: EmployeeProfilesController;
  let service: EmployeeProfilesService;

  const mockEmployeeProfile: EmployeeProfile = {
    id: 'employee-profile-uuid-1',
    userId: 'user-uuid-1',
    employeeCode: 'EMP001',
    hireDate: new Date('2023-01-15'),
    jobTitle: 'Software Engineer',
    department: 'Engineering',
    status: EmployeeStatus.ACTIVE,
    user: null, // Will be mocked or excluded in some tests
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockEmployeeProfilesService = {
    create: jest.fn((dto: CreateEmployeeProfileDto) => ({ ...mockEmployeeProfile, ...dto })),
    findAll: jest.fn(() => [mockEmployeeProfile]),
    findOne: jest.fn((id: string) => (id === mockEmployeeProfile.id ? mockEmployeeProfile : null)),
    update: jest.fn((id: string, dto: UpdateEmployeeProfileDto) => ({ ...mockEmployeeProfile, ...dto, id })),
    remove: jest.fn((id: string) => ({ affected: 1 })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeProfilesController],
      providers: [
        {
          provide: EmployeeProfilesService,
          useValue: mockEmployeeProfilesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Mock JwtAuthGuard
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard) // Mock RolesGuard
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<EmployeeProfilesController>(EmployeeProfilesController);
    service = module.get<EmployeeProfilesService>(EmployeeProfilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an employee profile', async () => {
      const createDto: CreateEmployeeProfileDto = {
        userId: 'some-user-uuid',
        employeeCode: 'EMP002',
        jobTitle: 'QA Engineer',
      };
      expect(await controller.create(createDto)).toEqual({
        ...mockEmployeeProfile,
        ...createDto,
      });
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of employee profiles', async () => {
      expect(await controller.findAll()).toEqual([mockEmployeeProfile]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single employee profile', async () => {
      expect(await controller.findOne(mockEmployeeProfile.id)).toEqual(mockEmployeeProfile);
      expect(service.findOne).toHaveBeenCalledWith(mockEmployeeProfile.id);
    });
  });

  describe('update', () => {
    it('should update an employee profile', async () => {
      const updateDto: UpdateEmployeeProfileDto = { jobTitle: 'Senior QA Engineer' };
      expect(await controller.update(mockEmployeeProfile.id, updateDto)).toEqual({
        ...mockEmployeeProfile,
        ...updateDto,
        id: mockEmployeeProfile.id,
      });
      expect(service.update).toHaveBeenCalledWith(mockEmployeeProfile.id, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove an employee profile', async () => {
      expect(await controller.remove(mockEmployeeProfile.id)).toEqual({ affected: 1 });
      expect(service.remove).toHaveBeenCalledWith(mockEmployeeProfile.id);
    });
  });
});
