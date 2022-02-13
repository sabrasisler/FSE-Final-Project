import express, { Request, Response } from 'express';
import { exit } from 'process';
import ControllerFactory from './controllers/ControllerFactory';
import UserDao from './daos/UserDao';
import configMongo from './mongoose/config';
import UserModel from './mongoose/users/UserModel';
import ErrorHandler from './shared/ErrorHandler';
import { registerMiddleWare } from './shared/registerMiddleWare';

const app = express();
app.use(express.json());
configMongo();

const userController = ControllerFactory.getInstance('user', app);
const tuitController = ControllerFactory.getInstance('tuit', app);
registerMiddleWare(app);

process.on('uncaughtException', function (err) {
  exit(1);
});

app.get('/hello', (req: Request, res: Response) => res.send('Hello World 1'));

const PORT = 4000;
app.listen(process.env.PORT || PORT, () => {
  console.log('Server running.');
});
