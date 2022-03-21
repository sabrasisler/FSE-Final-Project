import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let dbServer: MongoMemoryServer;

const init = async (): Promise<void> => {
  dbServer = await MongoMemoryServer.create();
};

const getUri = () => {
  const uri = dbServer.getUri();
  return uri;
};

// /**
//  * Connect to mock memory db.
//  */
export const connectDb = async () => {
  await init();
  const uri = dbServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    socketTimeoutMS: 45000,
  };
  await mongoose.connect(uri, mongooseOpts);
};
/**
 * Reconnect to the existing in memory db
 */
const reconnect = async () => {
  const uri = getUri();
  await mongoose.connect(uri);
};

// /**
//  * Close db connection
//  */
export const closeDatabase = async () => {
  await reconnect();
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await dbServer.stop();
};

/**
 * Delete db collections
 */
export const clearDatabase = async () => {
  await reconnect();
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
