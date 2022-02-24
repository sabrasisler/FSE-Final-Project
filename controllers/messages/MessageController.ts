import IMessageController from './IMessageController';
import { Request, Response, NextFunction, Express } from 'express';
import { HttpStatusCode } from '../HttpStatusCode';
import IMessageDao from '../../daos/messages/IMessageDao';
import IMessage from '../../models/messages/IMessage';
import IConversation from '../../models/messages/IConversation';
import AbsBaseController from '../AbsBaseController';
import IControllerRoute from '../IRoute';
import { Methods } from '../Methods';

export default class MessageController
  extends AbsBaseController
  implements IMessageController
{
  protected routes: IControllerRoute[];
  public readonly path: string;
  private readonly messageDao: IMessageDao;

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
    Object.freeze(this);
  }
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
}
