import { Schema } from 'mongoose';

export const formatJSON = (schema: Schema): void => {
  schema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
      delete ret.__v;
      ret.id = ret._id.toString();
      delete ret._id;
    },
  });
};
