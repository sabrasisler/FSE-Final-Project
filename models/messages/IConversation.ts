import IUser from '../users/IUser';
import { ConversationType } from './ConversationType';

export default interface IConversion {
  type: ConversationType;
  createdBy: IUser;
  cid?: string;
  participants: IUser[];
  removeFor?: IUser[];
}
