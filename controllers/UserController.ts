import User from '../models/users/User';
import { Express, NextFunction, Request, Response } from 'express';
import IController from './IController';
import IDao from '../daos/IDao';

export class UserController implements IController {
  private dao: IDao;
  public message: string;
  public constructor(app: Express, dao: IDao) {
    this.dao = dao;
    this.message = 'hello world';
  }
  findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    // console.log(req.body);
    const user = new User(
      req.body.username,
      req.body.firstName,
      req.body.lastName,
      req.body.password,
      req.body.email,
      req.body.profilePhoto,
      req.body.headerImage,
      req.body.accountType,
      req.body.bio,
      req.body.dateOfBirth,
      req.body.longitude,
      req.body.latitude
    );
    try {
      // const newUser = await this.dao.create(user);
      console.log('this object: ' + this);
      console.log(this.message);
      res.status(200).json('success');
    } catch (err) {
      next(err);
    }
  }
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = new User(
      req.body.username,
      req.body.firstName,
      req.body.lastName,
      req.body.password,
      req.body.email,
      req.body.profilePhoto,
      req.body.headerImage,
      req.body.accountType,
      req.body.bio,
      req.body.dateOfBirth,
      req.body.longitude,
      req.body.latitude
    );
    try {
      const updatedUser = await this.dao.update(user);
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.dao.delete(req.body.uid);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
  hello(): string {
    return this.message;
  }
}
