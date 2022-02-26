import IUser from '../users/IUser';
import { ConversationType } from './ConversationType';

/**
 * Model interface for a conversation used for the messages resource.
 */
export default interface IConversion {
  type: ConversationType;
  createdBy: IUser;
  cid?: string;
  participants: IUser[];
  removeFor?: IUser[];
}
