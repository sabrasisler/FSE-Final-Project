import mongoose from 'mongoose';
import IMessage from '../../models/messages/IMessage';
import MessageSchema from './MessageSchema';

/**
 * A Mongoose model for the message resource that takes a {@link MessageSchema}.
 * @module MessageModel
 */
export default mongoose.model<IMessage>('MessageModel', MessageSchema);
