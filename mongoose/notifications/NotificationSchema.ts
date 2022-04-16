import mongoose, { Schema } from 'mongoose';
import MongooseException from '../../errors/MongooseException';
import { NotificationType } from '../../models/notifications/NotificationType';
import INotification from "../../models/notifications/INotification";
import { formatJSON } from '../util/formatJSON';

/**
 * Mongoose schema for the notifications resource that takes an {@link INotifications} object. 
 * The schema contains a user foreign key reference. All fields are required, and created/updated time stamps are added.
 * @constructor LikeSchema
 * @param {String} type type of notification a user is receiving
 * @param {String} notificationString string representing the content of the notification
 * @param {Schema.Types.ObjectId} tuit the tuit foreign key
 * @param {Boolean} read has the notification been read?
 * @module LikeSchema
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
