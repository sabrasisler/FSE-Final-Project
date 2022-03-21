import mongoose from 'mongoose';
import { exit } from 'process';

export const configDatabase = (uri: string) => {
  mongoose
    .connect(uri)
    .then(() => {
      console.log('db connection successful.');
    })
    .catch((err) => {
      console.log('Error connecting to database.');
      exit(1);
    });
};

export default configDatabase;
