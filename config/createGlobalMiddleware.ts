import express, { RequestHandler, Express } from 'express';
import passport from 'passport';
import cookieSession from 'cookie-session';
import cors from 'cors';

const createGlobalMiddleware = (app: Express) => {
  const globalMiddleware: Array<RequestHandler> = [
    express.json(),
    cookieSession({
      name: 'session',
      keys: ['test'],
      maxAge: 24 * 60 * 60 * 100,
    }),
    passport.initialize(),
    passport.session(),
    cors({
      credentials: true,
      origin: process.env.CLIENT_URL!,
      methods: 'GET, POST, PUT, DELETE',
    }),
  ];

  for (const middleware of globalMiddleware) {
    app.use(middleware);
  }
};

export default createGlobalMiddleware;
