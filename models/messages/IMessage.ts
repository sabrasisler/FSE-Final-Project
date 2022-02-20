import IUser from '../users/IUser';
import IConversion from './IConversation';

export default interface IMessage {
  sender?: IUser;
  conversation: IConversion;
  message: string;
  removeFor?: IUser[];
}
