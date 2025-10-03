import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from '../../../../src/modules/content/questions/questions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question } from '../../../../src/modules/content/questions/entities/question.entity';
import { mockRepository } from '../../../utils/test-helpers';

describe('QuestionsService', () => {
  let service: QuestionsService;
  let questionRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        { provide: getRepositoryToken(Question), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
    questionRepository = module.get(getRepositoryToken(Question));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new question', async () => {
      const createQuestionDto = {
        questionText: 'How to use React?',
        askedBy: 'author-id',
      };
      const mockQuestion = { id: 'question-id', ...createQuestionDto };

      questionRepository.create.mockReturnValue(mockQuestion);
      questionRepository.save.mockResolvedValue(mockQuestion);

      const result = await service.create(createQuestionDto);

      expect(result).toEqual(mockQuestion);
      expect(questionRepository.create).toHaveBeenCalledWith(createQuestionDto);
    });
  });

  describe('findAll', () => {
    it('should return array of questions', async () => {
      const mockQuestions = [{ id: 'question-id', title: 'How to use React?' }];
      questionRepository.find.mockResolvedValue(mockQuestions);

      const result = await service.findAll();

      expect(result).toEqual(mockQuestions);
      expect(questionRepository.find).toHaveBeenCalled();
    });
  });
});
