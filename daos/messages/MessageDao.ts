import mongoose, { Model, SchemaTypes } from 'mongoose';
import IConversation from '../../models/messages/IConversation';
import IMessage from '../../models/messages/IMessage';
import IErrorHandler from '../../errors/IErrorHandler';
import IMessageDao from './IMessageDao';
import { MessageDaoErrors } from '../../errors/MessageDaoErrors';

export default class MessageDao implements IMessageDao {
  private readonly messageModel: Model<IMessage>;
  private readonly conversationModel: Model<IConversation>;
  private readonly errorHandler: IErrorHandler;
  public constructor(
    messageModel: Model<IMessage>,
    conversationModel: Model<IConversation>,
    errorHandler: IErrorHandler
  ) {
    this.messageModel = messageModel;
    this.conversationModel = conversationModel;
    this.errorHandler = errorHandler;
    Object.freeze(this);
  }
  createConversation = async (
    conversation: IConversation
  ): Promise<IConversation> => {
    const cid: string = conversation.participants.sort().join('');
    try {
      const convo = await this.conversationModel.create({
        ...conversation,
        cid,
      });
      return await convo.populate('createdBy');
    } catch (err) {
      throw this.errorHandler.createError(
        MessageDaoErrors.DB_ERROR_CREATING_CONVERSATION,
        err
      );
    }
  };
  createMessage = async (
    sender: string,
    message: IMessage
  ): Promise<IMessage> => {
    // Check if conversation for this message exists, and if sender is a participant in it.
    try {
      const existingConvo = await this.conversationModel.exists({
        _id: message.conversation,
        participants: { $in: [sender] },
      });
      if (existingConvo == null) {
        throw this.errorHandler.createError(
          MessageDaoErrors.INVALID_CONVERSATION
        );
      }
      const dbMessage = await this.messageModel.create({
        sender,
        ...message,
      });
      return await dbMessage.populate('sender');
    } catch (err) {
      throw this.errorHandler.createError(
        MessageDaoErrors.DB_ERROR_CREATING_MESSAGE,
        err
      );
    }
  };

  findAllMessagesByConversation = async (
    userId: string,
    conversationId: string
  ): Promise<IMessage[]> => {
    // First, make sure user is a participant in the conversation for which they're trying to get all messages from.
    try {
      const existingConvo = await this.conversationModel.exists({
        _id: conversationId,
        participants: { $in: [userId] },
      });

      this.errorHandler.handleNull(
        existingConvo,
        MessageDaoErrors.INVALID_CONVERSATION
      );
      const allMessagesForConversation = await this.messageModel.find({
        conversation: conversationId,
        removeFor: { $nin: [userId] },
      });
      this.errorHandler.handleNull(
        allMessagesForConversation,
        MessageDaoErrors.NO_MATCHING_MESSAGES
      );
      return allMessagesForConversation;
    } catch (err) {
      throw this.errorHandler.createError(
        MessageDaoErrors.DB_ERROR_GETTING_CONVERSATION_MESSAGES,
        err
      );
    }
  };
  findLatestMessagesByUser = async (uid: string): Promise<any[]> => {
    try {
      const userId = new mongoose.Types.ObjectId(uid);
      console.log(userId);
      const convo = await this.conversationModel.aggregate([
        {
          $match: {
            participants: {
              $in: [userId],
            },
            removeFrom: {
              $nin: [userId],
            },
          },
        },
        {
          $lookup: {
            from: 'messages',
            localField: '_id',
            foreignField: 'conversation',
            as: 'messages',
          },
        },
        {
          $unwind: {
            path: '$messages',
          },
        },
        {
          $sort: {
            'messages.createdAt': -1,
          },
        },
        {
          $group: {
            _id: '$_id',
            latestMessage: {
              $first: '$messages.message',
            },
            sender: {
              $first: '$messages.sender',
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'sender',
            foreignField: '_id',
            as: 'sender',
          },
        },
        {
          $unwind: {
            path: '$sender',
          },
        },
      ]);
      // return await this.conversationModel.populate(convo, {path: 'sender'})
      return convo;
    } catch (err) {
      throw this.errorHandler.createError(
        MessageDaoErrors.DB_ERROR_RETRIEVING_LAST_CONVERSATION_MESSAGES,
        err
      );
    }
  };

  deleteMessage = async (
    userId: string,
    messageId: string
  ): Promise<IMessage> => {
    try {
      const message = await this.messageModel.findOneAndUpdate(
        {
          _id: messageId,
        },
        {
          $addToSet: { removeFor: userId },
        }
      );
      return this.errorHandler.sameObjectOrNullException(
        message,
        MessageDaoErrors.NO_MESSAGE_FOUND
      );
    } catch (err) {
      throw this.errorHandler.createError(
        MessageDaoErrors.DB_ERROR_DELETING_MESSAGE,
        err
      );
    }
  };

  deleteConversation = async (
    userId: string,
    conversationId: string
  ): Promise<IConversation> => {
    try {
      const conversation = await this.conversationModel.findOneAndUpdate(
        {
          _id: conversationId,
        },
        {
          $addToSet: { removeFor: userId },
        },
        { new: true }
      );
      return this.errorHandler.sameObjectOrNullException(
        conversation,
        MessageDaoErrors.NO_CONVERSATION_FOUND
      );
    } catch (err) {
      throw this.errorHandler.createError(
        MessageDaoErrors.DB_ERROR_DELETING_CONVERSATION,
        err
      );
    }
  };
}
