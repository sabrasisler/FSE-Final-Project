import mongoose from 'mongoose';
import IConversion from '../../models/messages/IConversation';
import ConversationSchema from './ConversationSchema';

export default mongoose.model<IConversion>(
  'ConversationModel',
  ConversationSchema
);
