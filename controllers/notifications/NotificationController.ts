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


 export default class NotificationController {
    private readonly notificationDao: NotificationDao;
  
    /** Constructs the like controller with an injected ILikeDao interface implementation. Defines the endpoint paths, middleware, method types, and handler methods associated with each endpoint.
     *
     * @param {ILikeDao} likeDao a like dao implementing the ILikeDao interface used to find resources in the database.
     */
    constructor(
      path: string,
      app: Express,
      notificationDao: NotificationDao,
    ) {
      this.notificationDao = notificationDao;
      const router = Router();
      router.get(
        '/notifications',
        adaptRequest(this.findAllNotifications)
      );
      router.get(
        '/users/:userId/notifications',
        adaptRequest(this.findNotificationsForUser)
      );
      router.post(
        '/users/:userId/notifications',
        adaptRequest(this.createNotificationForUser)
      );
      router.post('users/:userId/notifications/:nid/read')
      app.use(path, router);
      Object.freeze(this); // Make this object immutable.
    }


    createNotificationForUser = async (req: HttpRequest): Promise<HttpResponse> => {
      const userNotifiedId = req.params.userId;
      const type = req.body.type;
      const userActing = req.body.userActing;

      // new like
      return {
          body: await this.notificationDao.createNotificationForUser(type, userNotifiedId, userActing)
      }
    };

    findNotificationsForUser = async (req: HttpRequest): Promise<HttpResponse> => {
      const notifications: INotification[] = await this.notificationDao.findAllNotificationsForUser(
        req.params.id
      );
      return okResponse(notifications);
    };
  
    findAllNotifications = async (
      req: HttpRequest
    ): Promise<HttpResponse> => {
      const notifications: INotification[] = await this.notificationDao.findAllNotifications();
      return okResponse(notifications);
    };

  /**
   * Processes updating a user by calling the dao with the user id and update body from the request object. Sends the updated user object back to the client, or passes any errors to the next function middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
   update = async (req: HttpRequest): Promise<HttpResponse> => {
    const nid = req.params.nid;
    const readNotification = await this.notificationDao.updateReadNotification(nid);
    return okResponse(readNotification);
  };
  }