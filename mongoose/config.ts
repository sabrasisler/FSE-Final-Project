import dotenv from 'dotenv';
import mongoose from 'mongoose';
import handleError from '../shared/handleError';
dotenv.config();

const configMongo = async () => {
  console.log();
  await mongoose
    .connect(process.env.MONGO_URL!)
    .then(() => {
      console.log('db connection successful.');
    })
    .catch((err) => {
      throw handleError(err, 'Error connecting to database.');
    });
};

export default configMongo;
