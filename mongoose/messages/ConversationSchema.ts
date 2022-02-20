import mongoose, { Schema } from 'mongoose';
import { ConversationType } from '../../models/messages/ConversationType';
import IConversion from '../../models/messages/IConversation';
import IMessage from '../../models/messages/IMessage';

const ConversationSchema = new mongoose.Schema<IConversion>(
  {
    type: { type: String, enum: ConversationType, required: true },
    cid: { type: String, unique: true, required: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'UserModel',
      required: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true,
      },
    ],
    removeFor: [
      {
        type: Schema.Types.ObjectId,
        ref: 'UserModel',
      },
    ],
    //   creator: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    //   recipient: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    //   visibleToCreator: { type: Boolean, default: true, required: true },
    //   visibleToRecipient: { type: Boolean, default: true, required: true },
  },
  { timestamps: true, collection: 'conversations' }
);
// ConversationSchema.index(
//   {
//     participants: 1,
//     participants.h
//   },
//   { unique: true }
// );
export default ConversationSchema;

/**
 * Delete convo: go through all messages that match uid and update visibility of all messages. Now when you pull, get all latest message by convo id that is visible. Should not return any "deleted" convos.
 *
 * Alt: go to convo object, and update visibility. Now when pulling all convo where user matchers participants, we only pull latest messages for visible convo id.
 */
