import express, { Express } from 'express';
import passport from 'passport';
import cookieSession from 'cookie-session';
import cors from 'cors';

const createGlobalMiddleware = (app: Express) => {
  const session = {
    secret: process.env.SESSION_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: false,
  };

  app.use(express.json());
  app.use(
    cors({
      credentials: true,
      origin: process.env.CLIENT_URL!,
      methods: 'GET, POST, PUT, DELETE',
      preflightContinue: true,
    })
  );
  app.use(
    cookieSession({
      name: 'session',
      keys: process.env.SESSION_KEYS!.split(', '),
      maxAge: 24 * 60 * 60 * 100,
      secure: process.env.NODE_ENV == 'PRODUCTION' ? true : false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
};

export default createGlobalMiddleware;
