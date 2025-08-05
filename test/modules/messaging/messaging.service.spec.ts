import { Test, TestingModule } from '@nestjs/testing';
import { MessagingService } from '../../../src/modules/messaging/messaging.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Conversation } from '../../../src/modules/messaging/entities/conversation.entity';
import { ConversationParticipant } from '../../../src/modules/messaging/entities/conversation-participant.entity';
import { Message } from '../../../src/modules/messaging/entities/message.entity';
import { mockRepository } from '../../utils/test-helpers';

describe('MessagingService', () => {
  let service: MessagingService;
  let conversationRepository: any;
  let participantRepository: any;
  let messageRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagingService,
        { provide: getRepositoryToken(Conversation), useValue: mockRepository() },
        { provide: getRepositoryToken(ConversationParticipant), useValue: mockRepository() },
        { provide: getRepositoryToken(Message), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<MessagingService>(MessagingService);
    conversationRepository = module.get(getRepositoryToken(Conversation));
    participantRepository = module.get(getRepositoryToken(ConversationParticipant));
    messageRepository = module.get(getRepositoryToken(Message));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createConversation', () => {
    it('should create a new conversation', async () => {
      const createConversationDto = {
        name: 'Project Discussion',
        isGroupChat: true,
        participantUserIds: ['user1', 'user2'],
      };
      const mockConversation = { id: 'conversation-id', name: 'Project Discussion', isGroupChat: true };

      conversationRepository.create.mockReturnValue(mockConversation);
      conversationRepository.save.mockResolvedValue(mockConversation);

      const result = await service.createConversation(createConversationDto);

      expect(result).toEqual(mockConversation);
      expect(conversationRepository.create).toHaveBeenCalledWith({ name: 'Project Discussion', isGroupChat: true });
    });
  });

  describe('createMessage', () => {
    it('should create a new message', async () => {
      const createMessageDto = {
        conversationId: 'conversation-id',
        senderId: 'sender-id',
        content: 'Hello world',
      };
      const mockConversation = { id: 'conversation-id' };
      const mockMessage = { id: 'message-id', senderId: 'sender-id', content: 'Hello world' };

      conversationRepository.findOne.mockResolvedValue(mockConversation);
      messageRepository.create.mockReturnValue(mockMessage);
      messageRepository.save.mockResolvedValue(mockMessage);

      const result = await service.createMessage(createMessageDto);

      expect(result).toEqual(mockMessage);
      expect(messageRepository.create).toHaveBeenCalledWith({
        senderId: 'sender-id',
        content: 'Hello world',
        conversation: mockConversation,
      });
    });
  });
});