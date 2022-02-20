import IConversion from '../../models/messages/IConversation';
import IMessage from '../../models/messages/IMessage';

export default interface IMessageDao {
  createConversation(conversation: IConversion): Promise<IConversion>;
  createMessage(sender: string, message: IMessage): Promise<IMessage>;
  findLatestMessagesByUser(userId: string): Promise<any[]>;
  findAllMessagesByConversation(
    userId: string,
    conversationId: string
  ): Promise<IMessage[]>;
  deleteConversation(
    userId: string,
    conversationId: string
  ): Promise<IConversion>;
  deleteMessage(userId: string, messageId: string): Promise<IMessage>;
}
