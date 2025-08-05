import { Test, TestingModule } from '@nestjs/testing';
import { SkillsService } from '../../../../src/modules/hr/skills/skills.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Skill } from '../../../../src/modules/hr/skills/entities/skills.entity';
import { mockRepository } from '../../../utils/test-helpers';

describe('SkillsService', () => {
  let service: SkillsService;
  let skillRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillsService,
        { provide: getRepositoryToken(Skill), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<SkillsService>(SkillsService);
    skillRepository = module.get(getRepositoryToken(Skill));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new skill', async () => {
      const createSkillDto = { name: 'JavaScript', category: 'Programming' };
      const mockSkill = { id: 'skill-id', ...createSkillDto };

      skillRepository.create.mockReturnValue(mockSkill);
      skillRepository.save.mockResolvedValue(mockSkill);

      const result = await service.create(createSkillDto);

      expect(result).toEqual(mockSkill);
      expect(skillRepository.create).toHaveBeenCalledWith(createSkillDto);
    });
  });

  describe('findAll', () => {
    it('should return array of skills', async () => {
      const mockSkills = [{ id: 'skill-id', name: 'JavaScript' }];
      skillRepository.find.mockResolvedValue(mockSkills);

      const result = await service.findAll();

      expect(result).toEqual(mockSkills);
      expect(skillRepository.find).toHaveBeenCalled();
    });
  });
});