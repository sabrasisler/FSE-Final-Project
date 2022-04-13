import dotenv from 'dotenv';
import { Server, Socket } from 'socket.io';
import { httpServer } from './configExpress';
import { Request, Response, NextFunction, response } from 'express';

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

// const onConnect = (action: Function, payload: any) => {
//   return socketServer.on('connect', (socket) => {
//     action(socket, payload);
//   });
// };
// const addUserToSocketRoom = (socket: Socket) => {
//   socket.on('JOIN_ROOM', (userId) => {
//     socket.join(userId);
//     console.log(`Room created for socket: ${socket.id}. User ${userId}`);
//   });
// };

// export const addSessionUserToSocketRoom = (sessionUserId: string) => {
//   socketServer.once('connect', (socket) => {
//     socket.on('JOIN_ROOM', () => {
//       socket.join(sessionUserId);
//       console.log(
//         `Room created for socket: ${socket.id}. User ${sessionUserId}`
//       );
//     });
//   });
// };

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
