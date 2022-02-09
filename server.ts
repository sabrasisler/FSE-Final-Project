import express, { Request, Response } from 'express';
import ControllerFactory from './controllers/ControllerFactory';
import UserDao from './daos/UserDao';
import { handleErrors } from './shared/handleErrors';
import configMongo from './mongoose/config';
const app = express();
app.use(express.json());
configMongo();

// app.use(handleErrors);

const userDao = new UserDao();
const controller = ControllerFactory.getInstance('user', app, userDao);

app.get('/hello', (req: Request, res: Response) => res.send('Hello World 1'));

const PORT = 4000;
app.listen(process.env.PORT || PORT, () => {
  console.log('Server running.');
});
