import dotenv from 'dotenv';
import configGlobalMiddleware from './config/configGlobalMiddleware';
import createControllers from './config/createControllers';
import configDatabase from './config/configDatabase';
import { handleUncaughtException } from './errors/handleCentralError';

import { app, httpServer } from './config/configExpress';
dotenv.config();

configDatabase(process.env.MONGO_URL!);
createControllers();
handleUncaughtException();

if (process.env.NODE_ENV! === 'PRODUCTION') {
  app.set('trust proxy', 1); // trust first proxy
}

httpServer.listen(process.env.PORT! || 4000, () => {
  console.log(`Up and running on port ${process.env.PORT! || 4000}`);
});
