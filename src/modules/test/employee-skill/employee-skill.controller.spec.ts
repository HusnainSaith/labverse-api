import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeSkillsController } from '../../../modules/employee-skills/employee-skills.controller';
import { EmployeeSkillsService } from '../../../modules/employee-skills/employee-skills.service';
import { CreateEmployeeSkillDto } from '../../../modules/employee-skills/dto/employee-skills.dto';
import { EmployeeSkill } from '../../../modules/employee-skills/entities/employee-skills.entity';
import { JwtAuthGuard } from '../../../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

describe('EmployeeSkillsController', () => {
  let controller: EmployeeSkillsController;
  let service: EmployeeSkillsService;

  // Mock data for EmployeeSkill entity
  const mockEmployeeSkill: EmployeeSkill = {
    employeeProfileId: 'employee-profile-uuid-1',
    skillId: 'skill-uuid-1',
    proficiencyLevel: 'Intermediate',
    yearsOfExperience: 2,
    employeeProfile: null, // Mocked in service, not directly used in controller tests
    skill: null, // Mocked in service, not directly used in controller tests
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Mock service methods
  const mockEmployeeSkillsService = {
    create: jest.fn((dto: CreateEmployeeSkillDto) => ({ ...mockEmployeeSkill, ...dto })),
    findAll: jest.fn(() => [mockEmployeeSkill]),
    findSkillsByEmployeeId: jest.fn((employeeProfileId: string) => [mockEmployeeSkill]),
    findEmployeesBySkillId: jest.fn((skillId: string) => [mockEmployeeSkill]),
    remove: jest.fn((employeeProfileId: string, skillId: string) => ({ affected: 1 })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeSkillsController],
      providers: [
        {
          provide: EmployeeSkillsService,
          useValue: mockEmployeeSkillsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Mock JwtAuthGuard
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard) // Mock RolesGuard
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<EmployeeSkillsController>(EmployeeSkillsController);
    service = module.get<EmployeeSkillsService>(EmployeeSkillsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create (assign-skill-to-employee)', () => {
    it('should assign a skill to an employee', async () => {
      const createDto: CreateEmployeeSkillDto = {
        employeeProfileId: 'employee-profile-uuid-2',
        skillId: 'skill-uuid-2',
        proficiencyLevel: 'Beginner',
        yearsOfExperience: 1,
      };
      expect(await controller.create(createDto)).toEqual({
        ...mockEmployeeSkill,
        ...createDto,
      });
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll (employee-skills)', () => {
    it('should return an array of all employee-skill associations', async () => {
      expect(await controller.findAll()).toEqual([mockEmployeeSkill]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findSkillsByEmployeeId (get skill by employee id)', () => {
    it('should return skills for a given employee ID', async () => {
      const employeeProfileId = 'employee-profile-uuid-1';
      expect(await controller.findSkillsByEmployeeId(employeeProfileId)).toEqual([mockEmployeeSkill]);
      expect(service.findSkillsByEmployeeId).toHaveBeenCalledWith(employeeProfileId);
    });
  });

  describe('findEmployeesBySkillId (get employee by skill id)', () => {
    it('should return employees for a given skill ID', async () => {
      const skillId = 'skill-uuid-1';
      expect(await controller.findEmployeesBySkillId(skillId)).toEqual([mockEmployeeSkill]);
      expect(service.findEmployeesBySkillId).toHaveBeenCalledWith(skillId);
    });
  });

  describe('remove (delete skill from employee)', () => {
    it('should remove a skill from an employee', async () => {
      const employeeProfileId = 'employee-profile-uuid-1';
      const skillId = 'skill-uuid-1';
      expect(await controller.remove(employeeProfileId, skillId)).toEqual({ affected: 1 });
      expect(service.remove).toHaveBeenCalledWith(employeeProfileId, skillId);
    });
  });
});
