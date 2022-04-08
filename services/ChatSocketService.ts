import { Server } from 'socket.io';

export default class ChatSocketService {
  private readonly io: Server;
  public constructor(io: Server) {
    this.io = io;
  }

  listenOnConversation = (conversationId: string) => {
    const conversationChat = this.io.of(conversationId);
    conversationChat.once('connection', (socket) => {
      console.log(
        '######Conversation Socket########',
        conversationChat.sockets
      );

      //message on listener

      socket.on('disconnect', (socket) => {
        console.log('someone disconnected from chat: ', conversationId);
      });
    });
  };
}
