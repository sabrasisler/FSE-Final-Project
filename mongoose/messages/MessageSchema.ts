import mongoose, { Schema } from 'mongoose';
import IMessage from '../../models/messages/IMessage';
import UserSchema from '../users/UserSchema';

const MessageSchema = new mongoose.Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'ConversationModel',
      required: true,
    },
    message: { type: String, required: true },
    removeFor: [
      {
        type: Schema.Types.ObjectId,
        ref: 'UserModel',
      },
    ],
  },
  { timestamps: true, collection: 'messages' }
);

// MessageSchema.index(
//   {
//     sender: 1,
//     recipient: 1,
//     conversationId: 1,
//   },
//   { unique: true }
// );

export default MessageSchema;
