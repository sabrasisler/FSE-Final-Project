import { Schema } from 'mongoose';

export const formatJSON = (schema: Schema): void => {
  schema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
      delete ret.__v;
      ret.id = ret._id.toString();
      delete ret._id;
      if (ret.birthday) ret.birthday = ret.birthday.toISOString().split('T')[0];
      ret.createdAt = ret.createdAt.toLocaleString([], {
        hour12: true,
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
      ret.updatedAt = ret.updatedAt.toISOString().split('T')[0];
    },
  });
};
