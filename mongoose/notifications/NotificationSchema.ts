import mongoose, { Schema } from 'mongoose';
import MongooseException from '../../errors/MongooseException';
import { NotificationType } from '../../models/notifications/NotificationType';
import INotification from "../../models/notifications/INotification";
import IUser from '../../models/users/IUser';
import { formatJSON } from '../util/formatJSON';

/**
 * Mongoose schema for the notifications resource that takes an {@link INotifications} object. 
 * The schema contains a user foreign key reference. All fields are required, and created/updated time stamps are added.
 * @constructor LikeSchema
 * @param {String} 
 * @param {Schema.Types.ObjectId} tuit the tuit foreign key
 * @module LikeSchema
 *
 */
const NotificationSchema = new mongoose.Schema<INotification>(
  {
    type: { type: String, enum: NotificationType, required: true},
    notificationString: {type: String},
    userNotified: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    userActing: {type: Schema.Types.ObjectId, ref: 'UserModel', required: true},
    read: {type: Boolean}
  },
  {
    timestamps: true,
    collection: 'notifications',
  }
);


formatJSON(NotificationSchema);
export default NotificationSchema;
