import HttpRequest from '../HttpRequest';
import HttpResponse from '../HttpResponse';
import IBaseController from '../IBaseController';

/**
 * Represents the interface of a message resource controller.
 */
export default interface IMessageController extends IBaseController {
  findAllMessagesByConversation(req: HttpRequest): Promise<HttpResponse>;
  findLatestMessagesByUser(req: HttpRequest): Promise<HttpResponse>;
  findAllMessagesSentByUser(req: HttpRequest): Promise<HttpResponse>;
  createConversation(req: HttpRequest): Promise<HttpResponse>;
  createMessage(req: HttpRequest): Promise<HttpResponse>;
  deleteMessage(req: HttpRequest): Promise<HttpResponse>;
  deleteConversation(req: HttpRequest): Promise<HttpResponse>;
}
