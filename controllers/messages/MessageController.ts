import IMessageController from './IMessageController';
import { Request, Response, NextFunction, Express } from 'express';
import { HttpStatusCode } from '../HttpStatusCode';
import IMessageDao from '../../daos/messages/IMessageDao';
import IMessage from '../../models/messages/IMessage';
import IConversation from '../../models/messages/IConversation';
import AbsBaseController from '../AbsBaseController';
import IControllerRoute from '../IRoute';
import { Methods } from '../Methods';

/**
 * Represents an implementation of an {@link IMessageController} and an extension of {@link AbsBaseController} to process all client api requests associated with messages.
 */
export default class MessageController
  extends AbsBaseController
  implements IMessageController
{
  protected routes: IControllerRoute[];
  public readonly path: string;
  private readonly messageDao: IMessageDao;

  /**
   * Constructs the message controller with a message dao dependency that implements {@link IMessageDao}. Calls the {@link AbsBaseController} super properties. Sets ups api paths for this controller with {@link IRoute} objects, later used by setRoutes() to wire app to the routes.
   * @param messageDao the message dao
   */
  public constructor(messageDao: IMessageDao) {
    super();
    this.path = '/api/v1/users';
    this.messageDao = messageDao;
    this.routes = [
      {
        path: '/:userId/messages',
        method: Methods.GET,
        handler: this.findLatestMessagesByUser,
        localMiddleware: [],
      },
      {
        path: '/:userId/conversations/:conversationId/messages',
        method: Methods.GET,
        handler: this.findAllMessagesByConversation,
        localMiddleware: [],
      },
      {
        path: '/:userId/conversations/',
        method: Methods.POST,
        handler: this.createConversation,
        localMiddleware: [],
      },
      {
        path: '/:userId/messages/',
        method: Methods.POST,
        handler: this.createMessage,
        localMiddleware: [],
      },
      {
        path: '/:userId/messages/:messageId',
        method: Methods.DELETE,
        handler: this.deleteMessage,
        localMiddleware: [],
      },
      {
        path: '/:userId/conversations/:conversationId',
        method: Methods.DELETE,
        handler: this.deleteConversation,
        localMiddleware: [],
      },
    ];
    Object.freeze(this); // Make this object immutable.
  }

  /**
   * Processes request and response of creating a new conversation, which will be associated with a message. Calls the message dao to create the conversation using with meta data, such as who created the conversations, the participants, and the type of conversation. Sends the new conversation object back to the client.
   *
   * @param {Request} req the express request coming from the client
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any additional processing
   * @returns void Promise
   */
  createConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const conversation: IConversation = {
        type: req.body.type,
        createdBy: req.body.createdBy,
        participants: req.body.participants,
      };
      const dbConversation: IConversation =
        await this.messageDao.createConversation(conversation);
      res.status(HttpStatusCode.ok).json(dbConversation);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Processes the request and response of creating a new message sent by the specified user. The request body specifies the conversation the message belongs to. Message dao is called to create the message, which is then sent back to the client.
   * @param {Request} req the express request coming from the client
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any additional processing
   * @returns void Promise
   */
  createMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const message: IMessage = {
        ...req.body,
      };
      const dbMessage = await this.messageDao.createMessage(
        req.params.userId,
        message
      );
      res.status(HttpStatusCode.ok).json(dbMessage);
    } catch (err) {
      next(err);
    }
  };
  /**
   * Processes request and response of finding all messages associated with a user and a conversation. Calls the message dao to find such messages using the user and conversation ids. Sends back an array of messages back to the client.
   * @param {Request} req the express request coming from the client
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any additional processing
   * @returns void Promise
   */
  findAllMessagesByConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const messages: IMessage[] =
        await this.messageDao.findAllMessagesByConversation(
          req.params.userId,
          req.params.conversationId
        );
      res.status(HttpStatusCode.ok).json(messages);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Processes request and response of finding the latest messages for each conversation the specified user currently has with the help of the messages dao. Sends back an array with the latest messages to the client.
   * @param {Request} req the express request coming from the client
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any additional processing
   * @returns void Promise
   */
  findLatestMessagesByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log(req.params.userId);
      const messages: IMessage[] =
        await this.messageDao.findLatestMessagesByUser(req.params.userId);
      res.status(HttpStatusCode.ok).json(messages);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Processes request and response of removing a message for the specified user by calling the message dao and passing the user and message id. Sends back the message that was deleted back to the client.
   * @param {Request} req the express request coming from the client
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any additional processing
   * @returns void Promise
   */
  deleteMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const deletedMessage = await this.messageDao.deleteMessage(
        req.params.userId,
        req.params.messageId
      );
      res.status(HttpStatusCode.ok).json(deletedMessage);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Processes request and response of removing a conversation for the specified user by passing user and conversation id to the message dao. Sends the deleted conversation back to the client.
   * @param {Request} req the express request coming from the client
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any additional processing
   * @returns void Promise
   */
  deleteConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const deletedConversation = await this.messageDao.deleteConversation(
        req.params.userId,
        req.params.conversationId
      );
      res.status(HttpStatusCode.ok).json(deletedConversation);
    } catch (err) {
      next(err);
    }
  };
}
