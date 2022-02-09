import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const configMongo = async () => {
  await mongoose
    .connect(process.env.MONGO_URL!)
    .then(() => {
      console.log('db connection successful.');
    })
    .catch((err) => console.log(err));
};

export default configMongo;
