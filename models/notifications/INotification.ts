import { NotificationType } from './NotificationType';
import IUser from "./../users/IUser"

/**
 * Model interface for a notification.
 */
export default interface IConversion {
  type: NotificationType;
  userNotified: IUser;
  read?: boolean;
}