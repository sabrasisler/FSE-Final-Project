import { Request, Response, NextFunction } from 'express';
import IMessageDao from '../../daos/messages/IMessageDao';

/**
 * Represents the interface of a message resource controller.
 */
export default interface IMessageController {
  findAllMessagesByConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  findLatestMessagesByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  createConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  createMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
