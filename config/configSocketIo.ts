import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { httpServer } from './configExpress';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const createServer = () => {
  const server: Server = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL!,
      credentials: true,
    },
  });
  server.on('connect', (socket) => {
    console.log(`Socket connected. ID: ${socket.id}`);
    // addUserToSocketRoom(socket);
    socket.on('disconnect', (reason) => {
      console.log(`Socket ${socket.id} disconnected. Reason: ${reason}.`);
    });
  });
  return server;
};

export const socketServer = createServer();

export const addUserToSocketRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    const user: any = req.user;
    socketServer.once('connect', (socket) => {
      socket.once('JOIN_ROOM', () => {
        socket.join(user.id);
        console.log(`Room created for socket: ${socket.id}. User ${user.id}`);
      });
    });
  }
  next();
};
