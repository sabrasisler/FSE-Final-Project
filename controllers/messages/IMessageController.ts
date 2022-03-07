import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import IBaseController from '../shared/IBaseController';

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
