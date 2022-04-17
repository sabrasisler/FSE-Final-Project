import { Model } from 'mongoose';
import INotification from '../../models/notifications/INotification';
import INotificationModel from "../../mongoose/notifications/NotificationModel";

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
            INotificationModel.find({ userNotified: userId }).populate("userNotified").populate("userActing").exec();

    /**
     * Finds all the notifications in the database
     * @returns an array of all the notifications
     */
    findAllNotifications = async (): Promise<INotification[]> => 
        INotificationModel.find()
        .populate("userNotified")
        .populate("userActing")
        .exec();
    /**
     * Creates a notification for a given user
     * @param notificationType string representing the content of notification such as a message, like, or follow
     * @param uid string represents the user id of the user being notified
     * @param uid2 string represents the user id of the user that did the action
     * @returns the notification entry inserted into the databse
     */
    createNotificationForUser = async (notificationType: string, uid: string, uid2: string): Promise<INotification> =>
        INotificationModel.create({userNotified: uid, userActing:uid2, type: notificationType, read:false});
    /**
     * Marks a notification as read.
     * @param nid 
     * @returns notification that has been updated
     */
    updateReadNotification = async (nid: string) : Promise<any> => INotificationModel.findOneAndUpdate({_id: nid}, {read:true});
}