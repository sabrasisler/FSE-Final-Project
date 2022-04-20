/**
 * @file Controller RESTful Web service API for notifications resource
 */

import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import { Express, Router } from 'express';
import { adaptRequest } from '../shared/adaptRequest';
import { okResponse as okResponse } from '../shared/createResponse';
import { isAuthenticated } from '../auth/isAuthenticated';
import INotification from "../../models/notifications/INotification";
import NotificationDao from '../../daos/notifications/NotificationsDao';
import { Server } from 'socket.io';


/**
 * Represents the implementation for handling the notifications resource api.
 */
export default class NotificationController {
  private readonly notificationDao: NotificationDao;
  private readonly socketServer: Server;

  /** Constructs the notifications controller with an notificationDao implementation. Defines the endpoint paths, middleware, method types, and handler methods associated with each endpoint.
   *
   * @param {NotificationDao} notification a notification dao used to find notifications resources in the database.
   */
  constructor(
    path: string,
    app: Express,
    notificationDao: NotificationDao,
    socketServer: Server
  ) {
    this.notificationDao = notificationDao;
    this.socketServer = socketServer;
    const router = Router();
    router.get(
      '/notifications',
      isAuthenticated,
      adaptRequest(this.findAllNotifications)
    );
    router.get(
      '/users/:userId/notifications',
      isAuthenticated,
      adaptRequest(this.findNotificationsForUser)
    );
    router.post(
      '/users/:userId/notifications',
      isAuthenticated,
      adaptRequest(this.createNotificationForUser)
    );
    router.put(
      '/notifications/:nid/read',
      isAuthenticated,
      adaptRequest(this.updateNotificationAsRead));
    app.use(path, router);
    Object.freeze(this); // Make this object immutable.
  }

  /**
   * Processes the endpoint request of creating a notification by calling the notificationDao, 
   * which will create and return a notification document. Also emits a NEW_NOTIFICATION message
   * to the recipient's socket server. This will allow their notifications page to be automatically
   * updated.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  createNotificationForUser = async (req: HttpRequest): Promise<HttpResponse> => {
    const userNotifiedId = req.params.userId;
    const type = req.body.type;
    const userActing = req.body.userActing;

    const notification = await this.notificationDao.createNotificationForUser(type, userNotifiedId, userActing);

    // Send a message to the socket listener for the notified user to recieve the new notification
    this.socketServer.to(userNotifiedId).emit('NEW_NOTIFICATION', notification);

    // new notification
    return {
      body: notification
    }
  };

  /**
   * Processes the request of finding all all notifications for a particular user. 
   * Calls the notifications dao to find the tuits, and returns the notifications back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findNotificationsForUser = async (req: HttpRequest): Promise<HttpResponse> => {
    const notifications: INotification[] = await this.notificationDao.findAllNotificationsForUser(
      req.params.userId
    );
    return okResponse(notifications);
  };

   /**
   * Processes the request of finding all all notifications in the database (used for testing). 
   * Calls the notifications dao to find the tuits, and returns the notifications back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findAllNotifications = async (
    req: HttpRequest
  ): Promise<HttpResponse> => {
    const notifications: INotification[] = await this.notificationDao.findAllNotifications();
    return okResponse(notifications);
  };

  /**
   * Processes of updating a notification to mark it as read by calling the dao with the notification id.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  updateNotificationAsRead = async (req: HttpRequest): Promise<HttpResponse> => {
    const nid = req.params.nid;
    const readNotification = await this.notificationDao.updateReadNotification(nid);
    return okResponse(readNotification);
  };
}