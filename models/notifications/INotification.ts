import { NotificationType } from './NotificationType';
import IUser from "./../users/IUser"

/**
 * Model interface for a notification.
 */
export default interface IConversion {
  type?: NotificationType;
  notificationString: string; 
  userNotified: IUser;
  userActing: IUser;
  read?: boolean;
}