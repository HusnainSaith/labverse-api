import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Patch,
  Delete,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { AddParticipantDto } from './dto/create-participant.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Messaging')
@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post('conversations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new conversation' })
  async createConversation(
    @Body() createConversationDto: CreateConversationDto,
  ) {
    return this.messagingService.createConversation(createConversationDto);
  }

  @Get('conversations/user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all conversations for a user' })
  async getUserConversations(@Param('userId') userId: string) {
    return this.messagingService.findUserConversations(userId);
  }

  @Get('conversations/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve a specific conversation' })
  async getConversationById(@Param('id') id: string) {
    return this.messagingService.findConversationById(id);
  }

  @Post('conversations/:conversationId/participants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Add a participant to a conversation' })
  async addParticipant(
    @Param('conversationId') conversationId: string,
    @Body() body: { participantUserIds?: string[]; userId?: string },
  ) {
    // Handle both single user and multiple users
    if (body.participantUserIds && Array.isArray(body.participantUserIds)) {
      const results = [];
      for (const userId of body.participantUserIds) {
        const participant = await this.messagingService.addParticipant(
          conversationId,
          userId,
        );
        results.push(participant);
      }
      return results;
    } else if (body.userId) {
      return this.messagingService.addParticipant(conversationId, body.userId);
    } else {
      throw new BadRequestException(
        'Either userId or participantUserIds array is required.',
      );
    }
  }

  @Delete('conversations/:conversationId/participants/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove a participant from a conversation' })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new message' })
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messagingService.createMessage(createMessageDto);
  }

  @Get('conversations/:conversationId/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all messages in a conversation' })
  async getMessagesByConversationId(
    @Param('conversationId') conversationId: string,
    @Query('take') take: string = '50',
    @Query('skip') skip: string = '0',
  ) {
    return this.messagingService.findMessagesByConversationId(
      conversationId,
      +take,
      +skip,
    );
  }

  @Patch('messages/:id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mark a message as read' })
  async markMessageAsRead(
    @Param('id') messageId: string,
    @Body('conversationId') conversationId: string,
    @Body('userId') userId: string,
  ) {
    await this.messagingService.markMessageAsRead(
      conversationId,
      userId,
      messageId,
    );
    return { message: 'Message marked as read.' };
  }

  @Delete('conversations/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a specific conversation' })
  async deleteConversation(@Param('id') id: string) {
    return this.messagingService.deleteConversation(id);
  }
}
