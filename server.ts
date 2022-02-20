import express, { Request, Response } from 'express';
import { exit } from 'process';
import ControllerFactory from './controllers/ControllerFactory';
import configMongo from './mongoose/config';
import { registerMiddleWare } from './shared/registerMiddleWare';

const app = express();
app.use(express.json());
configMongo();

const userController = ControllerFactory.getInstance('user', app);
const tuitController = ControllerFactory.getInstance('tuit', app);
const likesController = ControllerFactory.getInstance('like', app);
const messageController = ControllerFactory.getInstance('message', app);
registerMiddleWare(app);

process.on('uncaughtException', function (err) {
  exit(1);
});

app.get('/hello', (req: Request, res: Response) => res.send('Hello World 1'));

const PORT = 4000;
app.listen(process.env.PORT || PORT, () => {
  console.log('Server running.');
});
