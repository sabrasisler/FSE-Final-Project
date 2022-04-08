import dotenv from 'dotenv';
import { Server as SocketIoServer } from 'socket.io';
import { Express } from 'express';
import { createServer, Server } from 'http';

dotenv.config();

export const createSocket = (httpServer: Server) => {
  return new SocketIoServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL!,
      credentials: true,
    },
  });
};
