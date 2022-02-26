import mongoose, { Model, SchemaTypes } from 'mongoose';
import IConversation from '../../models/messages/IConversation';
import IMessage from '../../models/messages/IMessage';
import IErrorHandler from '../../errors/IErrorHandler';
import IMessageDao from './IMessageDao';
import { MessageDaoErrors } from '../../errors/MessageDaoErrors';

/**
 * DAO database CRUD operations for the messages resources. Implements {@link IMessage}. Takes a {@link MessageModel}, {@link ConversationModel}, and {@link IErrorHandler} as injected dependencies.
 */
export default class MessageDao implements IMessageDao {
  private readonly messageModel: Model<IMessage>;
  private readonly conversationModel: Model<IConversation>;
  private readonly errorHandler: IErrorHandler;

  /**
   * Constructs the model by setting the dependencies in state: the message model, the conversation model, and the error handle.
   * @param {MessageModel} messageModel the Mongoose message model for db operations
   * @param {ConversationModel} conversationModel the Mongoose conversation model for db operations
   * @param {IErrorHandler} errorHandler the error handler to deal with all exceptions
   */
  public constructor(
    messageModel: Model<IMessage>,
    conversationModel: Model<IConversation>,
    errorHandler: IErrorHandler
  ) {
    this.messageModel = messageModel;
    this.conversationModel = conversationModel;
    this.errorHandler = errorHandler;
    Object.freeze(this); // Make this object immutable.
  }

  /**
   * Create a conversation document by taking an {@link IConversation} object and calling the ConversationModel. In addition to the native _id of the conversation id, also create a conversationId field that is a sorted concatenation of all participant ids. This ensure the conversation document record is unique to avoid duplicating new conversation documents with the same participants.
   * @param conversation the conversation object with all its data
   * @returns the new conversation object after it is created in the ConversationModel
   */
  createConversation = async (
    conversation: IConversation
  ): Promise<IConversation> => {
    const conversationId: string = conversation.participants.sort().join('');
    try {
      const convo = await this.conversationModel.create({
        ...conversation,
        cid: conversationId,
      });
      return await convo.populate('createdBy');
    } catch (err) {
      throw this.errorHandler.createError(
        MessageDaoErrors.DB_ERROR_CREATING_CONVERSATION,
        err
      );
    }
  };

  /**
   * Create a new message for an existing conversation by using the existing id of the conversation this message belongs to. Also interact with the ConversationModel to check if sender is a participant in the conversation. If so, then call the MessageModel to create the message.
   * @param {string} sender the send of the message
   * @param {string} message the contents of the message
   * @returns the message document from the MessageModel
   */
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
      this.errorHandler.sameObjectOrNullException(
        existingConvo,
        MessageDaoErrors.INVALID_CONVERSATION
      );
      // Create the message.
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

  /**
   * Find all messages for conversation for the specified user and conversation ids. Also check if user if indeed a participant in the conversation for security reasons.
   * @param {string} userId the id of the user requesting the messages who should be a participant in the conversation
   * @param {string} conversationId the id of the conversation
   * @returns an array of all {@link IMessage} messages for the conversation.
   */
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

      this.errorHandler.sameObjectOrNullException(
        existingConvo,
        MessageDaoErrors.INVALID_CONVERSATION
      );
      // Retrieve all the messages for the conversation.
      const allMessagesForConversation = await this.messageModel.find({
        conversation: conversationId,
        removeFor: { $nin: [userId] },
      });
      this.errorHandler.sameObjectOrNullException(
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

  /**
   * Finds the latest messages per conversation for the specified user. This corresponds what the messages inbox is, where the latest messages are by conversation regardless of who sent the last message per conversation. Uses the mongo aggregate functionality to filter and sort through conversations/messages and to format the the returned output.
   * @param {string} uid the id of the user requesting the latest messages
   * @returns an array of {@link IMessage} latest messages per conversation
   */
  findLatestMessagesByUser = async (uid: string): Promise<IMessage[]> => {
    try {
      const userId = new mongoose.Types.ObjectId(uid);
      console.log(userId);
      /**
       * Aggregation piping steps to get latest message per conversation:
       * 1. Find all conversations where the user is a participant and where the user has not deleted/removed the conversation.
       * 2. With the found conversations, lookup all the messages that match the conversation id.
       * 3. Match the messages where the user has not removed/deleted the message.
       * 4. Do an unwind to split the conversation documents by each message belonging to the conversation. This will help with sorting by message in next step.
       * 5. Sort each conversation document in descending order by date of message creation.
       * 6. Group each result into a newly formatted document that only contains the message id, sender, and message content. This helps us get rid of all conversation document meta data we do not need.
       * 7. Look up the sender to populate the message object with all info of the sender.
       * 8. Do an unwind to split the documents by sender.
       */
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
          $match: {
            removeFrom: {
              $nin: [userId],
            },
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
      return convo;
    } catch (err) {
      throw this.errorHandler.createError(
        MessageDaoErrors.DB_ERROR_RETRIEVING_LAST_CONVERSATION_MESSAGES,
        err
      );
    }
  };

  /**
   * Remove a message for a particular user by finding the message in the database, and placing the user id in the array of removedFor. The message is not technically deleted, and the user is placed in the array of people for whom the message is no longer visible.
   * @param {string} userId the id of the user requesting to delete the message
   * @param {string} messageId the id of the message
   * @returns the deleted message from the Mongoose model once it has updated
   */
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
          $addToSet: { removeFor: userId }, // only unique entries in the array allowed
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
