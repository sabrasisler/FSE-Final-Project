import dotenv from 'dotenv';
import express from 'express';
import configGlobalMiddleware from './config/createGlobalMiddleware';
import createControllers from './config/createControllers';
import configDatabase from './config/configDatabase';
import {
  handleCentralError,
  handleUncaughtException,
} from './errors/handleCentralError';
import { createServer, Server } from 'http';
import { createSocket } from './config/configSocketIo';

dotenv.config();
const app = express();
const httpServer: Server = createServer(app);

const socket = createSocket(httpServer);
configDatabase(process.env.MONGO_URL!);
configGlobalMiddleware(app);
createControllers(app, socket);
app.use(handleCentralError);
handleUncaughtException();

if (process.env.NODE_ENV! === 'PRODUCTION') {
  app.set('trust proxy', 1); // trust first proxy
}

httpServer.listen(process.env.PORT! || 4000, () => {
  console.log(`Up and running on port ${process.env.PORT! || 4000}`);
});
