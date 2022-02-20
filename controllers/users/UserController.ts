import UserModel from '../../models/users/User';
import { NextFunction, Request, Response } from 'express';
import IController from '../IController';
import IDao from '../../daos/IDao';
import IUser from '../../models/users/IUser';
import { HttpStatusCode } from '../HttpStatusCode';

export class UserController implements IController {
  private readonly dao: IDao<IUser>;

  public constructor(dao: IDao<IUser>) {
    this.dao = dao;
    Object.freeze(this);
  }
  findAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const allUsers: IUser[] | null = await this.dao.findAll();
      res.status(200).json(allUsers);
    } catch (err) {
      next(err);
    }
  };
  findById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const existingUser: IUser = await this.dao.findById(req.params.uid);
      res.status(HttpStatusCode.ok).json(existingUser);
    } catch (err) {
      next(err);
    }
  };
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const data = { ...req.body, uid: req.params.uid };
    try {
      const newUser: IUser = await this.dao.create(data);
      res.status(HttpStatusCode.ok).json(newUser);
    } catch (err) {
      next(err);
    }
  };
  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const updatedUser = await this.dao.update(req.params.uid, req.body);
      res.status(HttpStatusCode.ok).json(updatedUser);
    } catch (err) {
      next(err);
    }
  };
  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const deletedUser = await this.dao.delete(req.params.uid);
      res.status(HttpStatusCode.ok).json(deletedUser);
    } catch (err) {
      next(err);
    }
  };
}
