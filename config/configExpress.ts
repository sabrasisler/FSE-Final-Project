import express from 'express';
import { Server, createServer } from 'http';
import configGlobalMiddleware from './configGlobalMiddleware';

const createApp = () => {
  const app = express();
  configGlobalMiddleware(app);
  return app;
};

export const app = createApp();
export const httpServer: Server = createServer(app);
