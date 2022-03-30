import express, { Express } from 'express';
import passport from 'passport';
import cookieSession from 'cookie-session';
import cors from 'cors';

const createGlobalMiddleware = (app: Express) => {
  //   let sess = {
  //     secret: process.env.EXPRESS_SESSION_SECRET,
  //     saveUninitialized: true,
  //     resave: true,
  //     cookie: {
  //         sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
  //         secure: process.env.NODE_ENV === "production",
  //     }
  // }
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
      keys: ['test'],
      maxAge: 24 * 60 * 60 * 100,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
};

export default createGlobalMiddleware;
