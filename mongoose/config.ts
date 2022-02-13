import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { exit } from 'process';
import ErrorHandler from '../shared/ErrorHandler';
dotenv.config();

const configMongo = async () => {
  console.log();
  await mongoose
    .connect(process.env.MONGO_URL!)
    .then(() => {
      console.log('db connection successful.');
    })
    .catch((err) => {
      console.log('Error connecting to database.');
      exit(1);
    });
};

export default configMongo;
