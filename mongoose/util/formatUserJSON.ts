import { Schema } from 'mongoose';
/**
 * Mongoose Virtuals middleware that formats information from the user schema from the database to the JSON payload. Example: removing the password field.
 * @param schema the schema to be formatted
 */
export const formatUserJSON = (schema: Schema): void => {
  schema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
      delete ret.password;
    },
  });
};
