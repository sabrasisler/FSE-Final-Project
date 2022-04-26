import IMessageController from './IMessageController';
import IMessageDao from '../../daos/messages/IMessageDao';
import IMessage from '../../models/messages/IMessage';
import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import { Express, Router } from 'express';
import { adaptRequest } from '../shared/adaptRequest';
import { Server } from 'socket.io';
import { okResponse } from '../shared/createResponse';
import { isAuthenticated } from '../auth/isAuthenticated';
import { addUserToSocketRoom } from '../../config/configSocketIo';
import NotificationDao from '../../daos/notifications/NotificationsDao';
import Notification from "../../models/notifications/INotification";

/**
 * Represents an implementation of an {@link IMessageController}
 */
export default class MessageController implements IMessageController {
  private readonly messageDao: IMessageDao;
  private readonly socketServer: Server;
  private readonly notificationDao: NotificationDao;

  /**
   * Constructs the message controller with a message dao dependency that implements {@link IMessageDao}.
   * @param messageDao the message dao
   */
  public constructor(
    path: string,
    app: Express,
    messageDao: IMessageDao,
    notificationDao: NotificationDao,
    socketServer: Server
  ) {
    this.messageDao = messageDao;
    this.notificationDao = notificationDao;
    this.socketServer = socketServer;
    const router: Router = Router();
    router.get(
      '/:userId/messages',
      isAuthenticated,
      addUserToSocketRoom,
      adaptRequest(this.findLatestMessagesByUser)
    );
    router.get(
      '/:userId/messages/sent',
      isAuthenticated,
      adaptRequest(this.findAllMessagesSentByUser)
    );
    router.get(
      '/:userId/conversations/:conversationId/messages',
      isAuthenticated,
      addUserToSocketRoom,
      adaptRequest(this.findAllMessagesByConversation)
    );
    router.post(
      '/:userId/conversations/',
      isAuthenticated,
      adaptRequest(this.createConversation)
    );

    router.post(
      '/:userId/conversations/:conversationId/messages/',
      isAuthenticated,
      adaptRequest(this.createMessage)
    );

    router.delete(
      '/:userId/messages/:messageId',
      isAuthenticated,
      adaptRequest(this.deleteMessage)
    );
    router.delete(
      '/:userId/conversations/:conversationId',
      isAuthenticated,
      adaptRequest(this.deleteConversation)
    );
    router.get(
      '/:userId/conversations/:conversationId',
      adaptRequest(this.findConversation)
    );
    app.use(path, router);
    Object.freeze(this); // Make this object immutable.
  }

  /**
   * Processes request and response of creating a new conversation, which will be associated with a message. Calls the message dao to create the conversation using with meta data, such as who created the conversations, the participants, and the type of conversation. Sends the new conversation object back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  createConversation = async (req: HttpRequest): Promise<HttpResponse> => {
    return okResponse({ body: await this.messageDao.createConversation(req.body)});
  };

  findConversation = async (req: HttpRequest): Promise<HttpResponse> => {
    const conversation = await this.messageDao.findConversation(
      req.params.conversationId
    );
    return okResponse(conversation);
  };

  /**
   * Processes the request and response of creating a new message sent by the specified user. The request body specifies the conversation the message belongs to. Message dao is called to create the message, which is then sent back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  createMessage = async (req: HttpRequest): Promise<any> => {
    const message: IMessage = {
      sender: req.params.userId,
      conversation: req.params.conversationId,
      message: req.body.message,
    };

    console.log(req.body)
    const newMessage: any = await this.messageDao.createMessage(
      req.params.userId,
      message
    );
    
    // Emit to client sockets
    const recipients = newMessage.conversation.participants;
    for (const recipient of recipients) {
      const newNotification: Notification = await this.notificationDao.createNotificationForUser("MESSAGES", recipient, req.params.userId,);
      this.socketServer.to(recipient.toString()).emit('NEW_MESSAGE', message);
      this.socketServer.to(recipient.toString()).emit('NEW_NOTIFICATION', message);
    }
    return okResponse(newMessage);
  };

  /**
   * Processes request and response of finding all messages associated with a user and a conversation. Calls the message dao to find such messages using the user and conversation ids. Sends back an array of messages back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findAllMessagesByConversation = async (
    req: HttpRequest
  ): Promise<HttpResponse> => {
    const messages = await this.messageDao.findAllMessagesByConversation(
      req.params.userId,
      req.params.conversationId
    );
    return okResponse(messages);
  };

  /**
   * Processes request and response of finding the latest messages for each conversation the specified user currently has with the help of the messages dao. Sends back an array with the latest messages to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findLatestMessagesByUser = async (
    req: HttpRequest
  ): Promise<HttpResponse> => {
    const userId = req.user.id;
    const messages: any = await this.messageDao.findLatestMessagesByUser(
      userId
    );
    return okResponse(messages);
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
