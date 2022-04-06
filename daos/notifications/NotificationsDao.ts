import { Model } from 'mongoose';
import INotification from '../../models/notifications/INotification';
import INotificationModel from "../../mongoose/notifications/NotificationModel";
import IDao from '../shared/IDao';

/**
 * DAO database CRUD operations for the notifications resource. Takes the injected dependencies of a {@link Model<INotification>} ORM model.
 */
export default class NotificationDao {
    private static notificationDao: NotificationDao | null = null;
    public static getInstance = (): NotificationDao => {
        if(NotificationDao.notificationDao === null) {
            NotificationDao.notificationDao = new NotificationDao();
        }
        return NotificationDao.notificationDao;
    }
    private constructor() {}
    /**
     * Finds all notifications belonging to a user id in the database. Populates the userNotified.
     * @param {string} userId the id of the user recieving notifications.
     * @returns an array of all notifications for the user id
     */
    findAllNotificationsForUser = async (userId: string): Promise<INotification[]> => 
            INotificationModel.find({ userNotified: userId }).populate("userNotified").exec();

    findAllNotifications = async (): Promise<INotification[]> => 
        INotificationModel.find()
        .populate("userNotified")
        .exec();

    createNotificationForUser = async (notificationType: string, uid: string): Promise<INotification> =>
        INotificationModel.create({userNotified: uid, type: notificationType, read:false});
}