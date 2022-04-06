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
      app.use(path, router);
      Object.freeze(this); // Make this object immutable.
    }


    createNotificationForUser = async (req: HttpRequest): Promise<HttpResponse> => {
      const userId = req.user.id;
      const type = req.body.type;

      // new like
      return {
          body: await this.notificationDao.createNotificationForUser(type, userId)
      }
    };

    findNotificationsForUser = async (req: HttpRequest): Promise<HttpResponse> => {
      const notifications: INotification[] = await this.notificationDao.findAllNotificationsForUser(
        req.user.id
      );
      return okResponse(notifications);
    };
  
    findAllNotifications = async (
      req: HttpRequest
    ): Promise<HttpResponse> => {
      const notifications: INotification[] = await this.notificationDao.findAllNotifications();
      return okResponse(notifications);
    };
  }
  





//  import {Express, Request, Response} from "express";
//  import NotificationsDao from "../daos/notifications/NotificationsDao";
 

//  export default class NotificationController {
//      private static notificationDao: NotificationsDao = NotificationsDao.getInstance();
//      private static notificationController: NotificationController | null = null;

//      public static getInstance = (app: Express): NotificationController => {
//          if(NotificationController.notificationController === null) {
//              NotificationController.notificationController = new NotificationController();
//              app.get("/api/users/:uid/notifications", NotificationController.notificationController.findNotificationsForUser);
//              app.get("/api//:tid/likes", LikeController.likeController.findAllUsersThatLikedTuit);
//              app.put("/api/users/:uid/likes/:tid", LikeController.likeController.userTogglesTuitLikes);
//          }
//          return LikeController.likeController;
//      }
 
//      private constructor() {}
 
//      /**
//       * Retrieves all users that liked a tuit from the database
//       * @param {Request} req Represents request from client, including the path
//       * parameter tid representing the liked tuit
//       * @param {Response} res Represents response to client, including the
//       * body formatted as JSON arrays containing the user objects
//       */
//      findAllUsersThatLikedTuit = (req: Request, res: Response) =>
//          LikeController.likeDao.findAllUsersThatLikedTuit(req.params.tid)
//              .then(likes => res.json(likes));
 
//      /**
//       * Retrieves all tuits liked by a user from the database
//       * @param {Request} req Represents request from client, including the path
//       * parameter uid representing the user liked the tuits
//       * @param {Response} res Represents response to client, including the
//       * body formatted as JSON arrays containing the tuit objects that were liked
//       */
//      findAllTuitsLikedByUser = (req: Request, res: Response) => {
//          const uid = req.params.uid;
//          // @ts-ignore
//          const profile = req.session['profile'];
//          const userId = uid === "me" && profile ?
//              profile._id : uid;
 
//          LikeController.likeDao.findAllTuitsLikedByUser(userId)
//              .then(likes => {
//                  const likesNonNullTuits = likes.filter(like => like.tuit);
//                  const tuitsFromLikes = likesNonNullTuits.map(like => like.tuit);
//                  res.json(tuitsFromLikes);
//              });
//      }
 
     
//      /**
//       * @param {Request} req Represents request from client, including the
//       * path parameters uid and tid representing the user that is liking the tuit
//       * and the tuit being liked
//       * @param {Response} res Represents response to client, including the
//       * body formatted as JSON containing the new likes that was inserted in the
//       * database
//       */
//      userTogglesTuitLikes = async (req: Request, res: Response) => {
//          const likeDao = LikeController.likeDao;
//          const tuitDao = LikeController.tuitDao;
//          const uid = req.params.uid;
//          const tid = req.params.tid;
//          // @ts-ignore
//          const profile = req.session['profile'];
//          const userId = uid === "me" && profile ?
//              profile._id : uid;
//          try {
//              const userAlreadyLikedTuit = await likeDao.findUserLikesTuit(userId, tid);
//              const howManyLikedTuit = await likeDao.countHowManyLikedTuit(tid);
//              let tuit = await tuitDao.findTuitById(tid);
//              if (userAlreadyLikedTuit) {
//                  await likeDao.userUnlikesTuit(userId, tid);
//                  tuit.stats.likes = howManyLikedTuit - 1;
//              } else {
//                  await LikeController.likeDao.userLikesTuit(userId, tid);
//                  tuit.stats.likes = howManyLikedTuit + 1;
//              };
//              await tuitDao.updateLikes(tid, tuit.stats);
//              res.sendStatus(200);
//          } catch (e) {
//              res.sendStatus(404);
//          }
//      }
//  };
