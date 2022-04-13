import { Schema } from 'mongoose';

export const formatUserJSON = (schema: Schema): void => {
  schema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
      ret.password = '***';

      //   delete ret.password;
    },
  });
};
