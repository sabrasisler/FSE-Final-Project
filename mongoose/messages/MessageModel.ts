import mongoose from 'mongoose';
import IMessage from '../../models/messages/IMessage';
import MessageSchema from './MessageSchema';

export default mongoose.model<IMessage>('MessgeModel', MessageSchema);
