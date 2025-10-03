import { Test, TestingModule } from '@nestjs/testing';
import { SupportTicketsService } from '../../../src/modules/support-tickets/support-tickets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticket } from '../../../src/modules/support-tickets/entities/ticket.entity';
import { TicketReply } from '../../../src/modules/support-tickets/entities/ticket-reply.entity';
import { mockRepository } from '../../utils/test-helpers';

describe('SupportTicketsService', () => {
  let service: SupportTicketsService;
  let ticketRepository: any;
  let ticketReplyRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupportTicketsService,
        { provide: getRepositoryToken(Ticket), useValue: mockRepository() },
        {
          provide: getRepositoryToken(TicketReply),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<SupportTicketsService>(SupportTicketsService);
    ticketRepository = module.get(getRepositoryToken(Ticket));
    ticketReplyRepository = module.get(getRepositoryToken(TicketReply));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTicket', () => {
    it('should create a new support ticket', async () => {
      const createTicketDto = {
        subject: 'Login Issue',
        description: 'Cannot login to account',
        clientId: 'client-id',
      };
      const mockTicket = { id: 'ticket-id', ...createTicketDto };

      ticketRepository.create.mockReturnValue(mockTicket);
      ticketRepository.save.mockResolvedValue(mockTicket);

      const result = await service.createTicket(createTicketDto);

      expect(result).toEqual(mockTicket);
      expect(ticketRepository.create).toHaveBeenCalledWith(createTicketDto);
    });
  });

  describe('addReplyToTicket', () => {
    it('should add a reply to ticket', async () => {
      const ticketId = 'ticket-id';
      const createReplyDto = {
        content: 'We are looking into this issue',
        senderId: 'author-id',
        message: 'We are looking into this issue',
      };
      const mockReply = { id: 'reply-id', ...createReplyDto, ticketId };

      ticketRepository.findOne.mockResolvedValue({ id: ticketId });
      ticketReplyRepository.create.mockReturnValue(mockReply);
      ticketReplyRepository.save.mockResolvedValue(mockReply);

      const result = await service.addReplyToTicket(ticketId, createReplyDto);

      expect(result).toEqual(mockReply);
      expect(ticketReplyRepository.create).toHaveBeenCalledWith({
        ...createReplyDto,
        ticketId,
      });
    });
  });
});
