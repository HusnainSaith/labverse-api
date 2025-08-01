import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { Message } from './entities/message.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(Conversation) private conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationParticipant) private participantRepository: Repository<ConversationParticipant>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  /**
   * Creates a new conversation with initial participants.
   * @param createConversationDto DTO for creating a conversation.
   * @returns The newly created conversation.
   */
  async createConversation(createConversationDto: CreateConversationDto): Promise<Conversation> {
    const { participantUserIds, ...conversationData } = createConversationDto;

    // Add a check to ensure participantUserIds is a valid array
    if (!participantUserIds || !Array.isArray(participantUserIds) || participantUserIds.length === 0) {
      throw new BadRequestException('`participantUserIds` must be a non-empty array of user IDs.');
    }

    if (!conversationData.isGroupChat && participantUserIds.length > 2) {
      throw new BadRequestException('Direct chats cannot have more than two participants.');
    }

    const conversation = this.conversationRepository.create(conversationData);
    const savedConversation = await this.conversationRepository.save(conversation);

    // Create participants by linking them to the saved conversation object
    const participants = participantUserIds.map((userId) => {
      return this.participantRepository.create({
        conversation: savedConversation,
        userId,
      });
    });

    await this.participantRepository.save(participants);
    return savedConversation;
  }

  /**
   * Retrieves all conversations for a given user.
   * @param userId The ID of the user.
   * @returns An array of conversations.
   */
  async findUserConversations(userId: string): Promise<Conversation[]> {
    const participants = await this.participantRepository.find({
      where: { userId },
      relations: ['conversation'],
    });

    return participants.map((p) => p.conversation);
  }

  /**
   * Finds a single conversation by its ID.
   * @param id The ID of the conversation.
   * @returns The conversation with its participants.
   */
  async findConversationById(id: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: ['participants'],
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    return conversation;
  }

  /**
   * Adds a new participant to a conversation.
   * @param conversationId The ID of the conversation.
   * @param userId The ID of the user to add.
   * @returns The updated conversation.
   */
  async addParticipant(conversationId: string, userId: string): Promise<ConversationParticipant> {
    const conversation = await this.findConversationById(conversationId);
    
    // Check if it's a direct chat using the correct property name
    if (!conversation) {
      throw new BadRequestException('Cannot add participants to a direct chat.');
    }

    // Use the relation in the where clause
    const existingParticipant = await this.participantRepository.findOne({
      where: { conversation: { id: conversationId }, userId },
    });
    if (existingParticipant) {
      throw new BadRequestException('User is already a participant.');
    }

    // Create a new participant using the conversation object
    const newParticipant = this.participantRepository.create({
      conversation,
      userId,
    });
    return await this.participantRepository.save(newParticipant);
  }

  /**
   * Removes a participant from a conversation.
   * @param conversationId The ID of the conversation.
   * @param userId The ID of the user to remove.
   */
  async removeParticipant(conversationId: string, userId: string): Promise<void> {
    const conversation = await this.findConversationById(conversationId);
    
    // Check if it's a direct chat using the correct property name
    if (!conversation.is_group_chat) {
      throw new BadRequestException('Cannot remove participants from a direct chat.');
    }

    // Use the relation in the where clause
    const participant = await this.participantRepository.findOne({
      where: { conversation: { id: conversationId }, userId },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found in this conversation.');
    }

    await this.participantRepository.remove(participant);
  }

  /**
   * Creates a new message in a conversation.
   * @param createMessageDto DTO for creating a message.
   * @returns The newly created message.
   */
  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const { conversationId, ...messageData } = createMessageDto;

    // Fetch the full conversation object to link the message correctly
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${conversationId} not found.`);
    }

    // Create the message with the conversation object, not just the ID
    const message = this.messageRepository.create({
      ...messageData,
      conversation,
    });

    return await this.messageRepository.save(message);
  }

  /**
   * Retrieves messages for a specific conversation.
   * @param conversationId The ID of the conversation.
   * @param take Number of messages to retrieve.
   * @param skip Number of messages to skip (for pagination).
   * @returns An array of messages.
   */
  async findMessagesByConversationId(conversationId: string, take: number = 50, skip: number = 0): Promise<Message[]> {
    const conversationExists = await this.conversationRepository.exists({ where: { id: conversationId } });
    if (!conversationExists) {
      throw new NotFoundException(`Conversation with ID ${conversationId} not found.`);
    }

    // Use the relation in the where clause
    return this.messageRepository.find({
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'DESC' },
      take,
      skip,
    });
  }

  /**
   * Marks a message as read by a user.
   * @param conversationId The ID of the conversation.
   * @param userId The ID of the user who read the message.
   * @param messageId The ID of the message that was read.
   */
  async markMessageAsRead(conversationId: string, userId: string, messageId: string): Promise<void> {
    // Find the participant using the conversation relation
    const participant = await this.participantRepository.findOne({
      where: { conversation: { id: conversationId }, userId },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found in this conversation.');
    }

    // Find the message to link it to the participant
    const message = await this.messageRepository.findOne({ where: { id: messageId } });
    if (!message) {
      throw new NotFoundException('Message not found.');
    }

    // Update the lastReadMessage relationship for the participant
    participant.lastReadMessage = message;
    await this.participantRepository.save(participant);
  }
}
