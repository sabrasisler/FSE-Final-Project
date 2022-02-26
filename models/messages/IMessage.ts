import IUser from '../users/IUser';
import IConversion from './IConversation';

/**
 * Model interface for a message.
 */
export default interface IMessage {
  sender?: IUser;
  conversation: IConversion;
  message: string;
  removeFor?: IUser[];
}
