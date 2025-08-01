import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  NotFoundException,
  Query,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { AddParticipantDto } from './dto/create-participant.dto';
import { get } from 'http';

@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post('conversations')
  async createConversation(@Body() createConversationDto: CreateConversationDto) {
    return this.messagingService.createConversation(createConversationDto);
  }

  @Get('conversations/user/:userId')
  async getUserConversations(@Param('userId') userId: string) {
    return this.messagingService.findUserConversations(userId);
  }

  @Get('conversations/:id')
  async getConversationById(@Param('id') id: string) {
    return this.messagingService.findConversationById(id);
  }

  @Post('conversations/:conversationId/participants')
  async addParticipant(
    @Param('conversationId') conversationId: string,
    @Body() addParticipantDto: AddParticipantDto,
  ) {
    if (!addParticipantDto.userId) {
      throw new BadRequestException('User ID is required.');
    }
    return this.messagingService.addParticipant(conversationId, addParticipantDto.userId);
  }

  @Delete('conversations/:conversationId/participants/:userId')
  async removeParticipant(
    @Param('conversationId') conversationId: string,
    @Param('userId') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('User ID is required.');
    }
    await this.messagingService.removeParticipant(conversationId, userId);
    return { message: 'Participant removed successfully.' };
  }

  @Post('messages')
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messagingService.createMessage(createMessageDto);
  }

  @Get('conversations/:conversationId/messages')
  async getMessagesByConversationId(
    @Param('conversationId') conversationId: string,
    @Query('take') take: string = '50',
    @Query('skip') skip: string = '0',
  ) {
    return this.messagingService.findMessagesByConversationId(conversationId, +take, +skip);
  }

  @Get('messages/:id/read')
  async markMessageAsRead(
    @Param('id') messageId: string,
    @Body('conversationId') conversationId: string,
    @Body('userId') userId: string,
  ) {
    await this.messagingService.markMessageAsRead(conversationId, userId, messageId);
    return { message: 'Message marked as read.' };
  }
}
