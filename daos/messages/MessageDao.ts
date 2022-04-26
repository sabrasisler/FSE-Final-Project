import mongoose, { Model, SchemaTypes } from 'mongoose';
import IConversation from '../../models/messages/IConversation';
import IMessage from '../../models/messages/IMessage';
import IErrorHandler from '../../errors/IErrorHandler';
import IMessageDao from './IMessageDao';
import { MessageDaoErrors } from './MessageDaoErrors';
import { ConversationType } from '../../models/messages/ConversationType';

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
    let participants = conversation.participants;
    if (!conversation.participants.includes(conversation.createdBy)) {
      participants.push(conversation.createdBy);
    }
    let type: ConversationType;
    if (conversation.participants.length > 2) {
      type = ConversationType.Group;
    } else {
      type = ConversationType.Private;
    }
    const conversationId: string = conversation.participants.sort().join('');
    try {
      const convo = await this.conversationModel
        .findOneAndUpdate(
          { cid: conversationId },
          {
            ...conversation,
            cid: conversationId,
            type,
            participants,
            $pull: { removeFor: { $in: [conversation.createdBy] } },
          },
          { upsert: true, new: true }
        )
        .populate('participants');
      return await convo.populate('createdBy');
    } catch (err) {
      throw this.errorHandler.handleError(
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
      this.errorHandler.objectOrNullException(
        existingConvo,
        MessageDaoErrors.INVALID_CONVERSATION
      );
      // Create the message.
      const dbMessage = await this.messageModel.create({
        sender,
        ...message,
      });
      await (await dbMessage.populate('sender')).populate('conversation');
      return dbMessage;
    } catch (err) {
      throw this.errorHandler.handleError(
        MessageDaoErrors.DB_ERROR_CREATING_MESSAGE,
        err
      );
    }
  };

  findConversation = async (conversationId: string): Promise<IConversation> => {
    // First, make sure user is a participant in the conversation for which they're trying to get all messages from.
    try {
      const existingConvo = await this.conversationModel
        .findOne({
          _id: conversationId,
        })
        .populate('participants');
      this.errorHandler.objectOrNullException(
        existingConvo,
        MessageDaoErrors.INVALID_CONVERSATION
      );

      return this.errorHandler.objectOrNullException(
        existingConvo,
        MessageDaoErrors.NO_CONVERSATION_FOUND
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        MessageDaoErrors.DB_ERROR_FINDING_CONVERSATION,
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

      this.errorHandler.objectOrNullException(
        existingConvo,
        MessageDaoErrors.INVALID_CONVERSATION
      );
      // Retrieve all the messages for the conversation.
      const allMessagesForConversation = await this.messageModel
        .find({
          conversation: conversationId,
          removeFor: { $nin: [userId] },
        })
        .populate('sender');

      this.errorHandler.objectOrNullException(
        allMessagesForConversation,
        MessageDaoErrors.NO_MATCHING_MESSAGES
      );
      return allMessagesForConversation;
    } catch (err) {
      throw this.errorHandler.handleError(
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
      /**
       * Aggregation piping steps to get latest message per conversation:
       */
      const convo = await this.conversationModel.aggregate([
        // Find all conversations where the user is a participant and where the user has not deleted/removed the conversation.
        {
          $match: {
            participants: {
              $in: [userId],
            },
            removeFor: {
              $nin: [userId],
            },
          },
        },
        /**
         * Populate the participants foreign key arrays by looking up the FKs in the user table/document. Filter the results with pipeline to only display necessary user info.
         */
        {
          $lookup: {
            from: 'users',
            localField: 'participants',
            foreignField: '_id',
            pipeline: [
              {
                $match: {
                  _id: { $ne: userId },
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  firstName: 1,
                  lastName: 1,
                  profilePhoto: 1,
                },
              },
            ],
            as: 'recipients',
          },
        },

        // With the found conversations, look up messages from message collection that match the conversation id.
        {
          $lookup: {
            from: 'messages',
            localField: '_id',
            foreignField: 'conversation',
            as: 'messages',
          },
        },
        // Match the messages where the user has not removed/deleted the message.
        {
          $match: {
            removeFrom: {
              $nin: [userId],
            },
          },
        },
        // Do an unwind to split the conversation documents by each message belonging to the conversation. This will help with sorting by message in next step.

        {
          $unwind: {
            path: '$messages',
          },
        },
        // Sort each conversation document in descending order by date of message creation.
        {
          $sort: {
            'messages.createdAt': -1,
          },
        },
        // Group each result into a newly formatted document that only contains the message id, sender, and message content. This helps us get rid of all conversation document meta data we do not need.
        {
          $group: {
            _id: '$_id',
            recipients: {
              $first: '$recipients',
            },
            latestMessage: {
              $first: '$messages.message',
            },
            latestMessageId: {
              $first: '$messages._id',
            },
            sender: {
              $first: '$messages.sender',
            },
            createdAt: {
              $first: '$messages.createdAt',
            },
            removeFor: {
              $first: '$messages.removeFor',
            },
          },
        },

        //  Look up the sender to populate the message object with all info of the sender.
        {
          $lookup: {
            from: 'users',
            localField: 'sender',
            foreignField: '_id',
            pipeline: [
              // Filter results to only include relevant sender info.
              {
                $project: {
                  _id: 0,
                  id: '$_id',
                  name: 1,
                  firstName: 1,
                  lastName: 1,
                  profilePhoto: 1,
                },
              },
            ],
            as: 'sender',
          },
        },
        // Do an unwind to split the documents by sender.
        {
          $unwind: {
            path: '$sender',
          },
        },
        {
          $project: {
            _id: 0,
            id: '$latestMessageId',
            message: '$latestMessage',
            sender: '$sender',
            conversation: '$_id',
            removeFor: '$removeFor',
            recipients: '$recipients',
            createdAt: '$createdAt',
          },
        },
        {
          // Sort all results by descending order.
          $sort: {
            createdAt: -1,
          },
        },
      ]);
      return convo;
    } catch (err) {
      throw this.errorHandler.handleError(
        MessageDaoErrors.DB_ERROR_RETRIEVING_LAST_CONVERSATION_MESSAGES,
        err
      );
    }
  };

  findAllMessagesSentByUser = async (userId: string): Promise<IMessage[]> => {
    try {
      const messages: IMessage[] = await this.messageModel.find({
        sender: userId,
      });
      return messages;
    } catch (err) {
      throw this.errorHandler.handleError(
        MessageDaoErrors.DB_ERROR_ALL_MESSAGES_SENT_BY_USER,
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
      return this.errorHandler.objectOrNullException(
        message,
        MessageDaoErrors.NO_MESSAGE_FOUND
      );
    } catch (err) {
      throw this.errorHandler.handleError(
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
      await this.messageModel.updateMany(
        {
          conversation: conversationId,
        },
        {
          $addToSet: { removeFor: userId },
        }
      );
      return this.errorHandler.objectOrNullException(
        conversation,
        MessageDaoErrors.NO_CONVERSATION_FOUND
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        MessageDaoErrors.DB_ERROR_DELETING_CONVERSATION,
        err
      );
    }
  };
}
