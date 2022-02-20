import IMessageController from './IMessageController';
import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../HttpStatusCode';
import IMessageDao from '../../daos/messages/IMessageDao';
import IMessage from '../../models/messages/IMessage';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import IConversation from '../../models/messages/IConversation';
export default class MessageController implements IMessageController {
  private readonly messageDao: IMessageDao;
  public constructor(messageDao: IMessageDao) {
    this.messageDao = messageDao;
    Object.freeze(this);
  }
  createConversation = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
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
