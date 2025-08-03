import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagingService } from './messaging.service';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagingService: MessagingService) {}

  /**
   * Handle new WebSocket connections.
   * @param client The client socket.
   */
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  /**
   * Handle WebSocket disconnections.
   * @param client The client socket.
   */
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Handles a new message event from a client.
   * @param client The client socket.
   * @param payload The message data.
   * @returns The created message.
   */
  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: CreateMessageDto): Promise<void> {
    try {
      const message = await this.messagingService.createMessage(payload);
      // Emit 'newMessage' event to all participants of the conversation.
      this.server.to(payload.conversationId).emit('newMessage', message);
    } catch (error) {
      // You might want to handle errors and emit an error event back to the client.
      client.emit('error', 'Failed to send message.');
    }
  }

  /**
   * Handles a message read event.
   * @param client The client socket.
   * @param payload The payload containing conversationId, userId, and messageId.
   */
  @SubscribeMessage('readMessage')
  async handleReadMessage(client: Socket, payload: { conversationId: string; userId: string; messageId: string }): Promise<void> {
    const { conversationId, userId, messageId } = payload;
    try {
      await this.messagingService.markMessageAsRead(conversationId, userId, messageId);
      // Emit 'messageRead' event to all participants of the conversation.
      this.server.to(conversationId).emit('messageRead', { conversationId, userId, messageId });
    } catch (error) {
      client.emit('error', 'Failed to mark message as read.');
    }
  }
}