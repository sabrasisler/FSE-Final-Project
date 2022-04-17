import mongoose from 'mongoose';
import INotifications from '../../models/notifications/INotification';
import NotificationSchema from './NotificationSchema';

/**
 * Mongoose database model for the notifications resource. Uses a {@link NotifcationSchema}.
 * @module NotificationModel
 */
export default mongoose.model<INotifications>('NotificationModel', NotificationSchema);