import IMessageController from './IMessageController';
import IMessageDao from '../../daos/messages/IMessageDao';
import IMessage from '../../models/messages/IMessage';
import IConversation from '../../models/messages/IConversation';
import { Methods } from '../Methods';
import IControllerRoute from '../IControllerRoute';
import HttpRequest from '../HttpRequest';
import HttpResponse from '../HttpResponse';

/**
 * Represents an implementation of an {@link IMessageController}
 */
export default class MessageController implements IMessageController {
  public readonly routes: IControllerRoute[];
  public readonly path: string;
  private readonly messageDao: IMessageDao;

  /**
   * Constructs the message controller with a message dao dependency that implements {@link IMessageDao}.
   * @param messageDao the message dao
   */
  public constructor(messageDao: IMessageDao) {
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
        path: '/:userId/messages/sent',
        method: Methods.GET,
        handler: this.findAllMessagesSentByUser,
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
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  createConversation = async (req: HttpRequest): Promise<HttpResponse> => {
    const conversation: IConversation = {
      type: req.body.type,
      createdBy: req.body.createdBy,
      participants: req.body.participants,
    };
    return { body: await this.messageDao.createConversation(conversation) };
  };

  /**
   * Processes the request and response of creating a new message sent by the specified user. The request body specifies the conversation the message belongs to. Message dao is called to create the message, which is then sent back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  createMessage = async (req: HttpRequest): Promise<HttpResponse> => {
    const message: IMessage = {
      ...req.body,
    };
    return {
      body: await this.messageDao.createMessage(req.params.userId, message),
    };
  };
  /**
   * Processes request and response of finding all messages associated with a user and a conversation. Calls the message dao to find such messages using the user and conversation ids. Sends back an array of messages back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findAllMessagesByConversation = async (
    req: HttpRequest
  ): Promise<HttpResponse> => {
    return {
      body: await this.messageDao.findAllMessagesByConversation(
        req.params.userId,
        req.params.conversationId
      ),
    };
  };

  /**
   * Processes request and response of finding the latest messages for each conversation the specified user currently has with the help of the messages dao. Sends back an array with the latest messages to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findLatestMessagesByUser = async (
    req: HttpRequest
  ): Promise<HttpResponse> => {
    return {
      body: await this.messageDao.findLatestMessagesByUser(req.params.userId),
    };
  };

  findAllMessagesSentByUser = async (
    req: HttpRequest
  ): Promise<HttpResponse> => {
    return {
      body: await this.messageDao.findAllMessagesSentByUser(req.params.userId),
    };
  };

  /**
   * Processes request and response of removing a message for the specified user by calling the message dao and passing the user and message id. Sends back the message that was deleted back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  deleteMessage = async (req: HttpRequest): Promise<HttpResponse> => {
    return {
      body: await this.messageDao.deleteMessage(
        req.params.userId,
        req.params.messageId
      ),
    };
  };

  /**
   * Processes request and response of removing a conversation for the specified user by passing user and conversation id to the message dao. Sends the deleted conversation back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  deleteConversation = async (req: HttpRequest): Promise<HttpResponse> => {
    return {
      body: await this.messageDao.deleteConversation(
        req.params.userId,
        req.params.conversationId
      ),
    };
  };
}
