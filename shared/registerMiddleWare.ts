import ErrorHandler from './ErrorHandler';
import { Express } from 'express';

const registerMiddleWare = (app: Express) => {
  app.use(ErrorHandler.handleCentralError);
};

export { registerMiddleWare };
