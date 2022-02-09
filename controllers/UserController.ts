import UserModel from '../models/users/User';
import { Express, NextFunction, Request, Response } from 'express';
import IController from './IController';
import IDao from '../daos/IDao';
import ControllerFactory from './ControllerFactory';
import { ControllerErrors } from './ControllerErrors';
import IUser from '../models/users/IUser';

export class UserController implements IController {
  private dao: IDao;

  public constructor(app: Express, dao: IDao) {
    this.dao = dao;
  }
  findAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const allUsers: IUser[] = await this.dao.findAll();
      if (allUsers == null) {
        res.status(404).json(ControllerErrors.NO_USERS_FOUND);
      } else {
        res.status(200).json(allUsers);
      }
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
      console.log(req.params.uid);
      const existingUser: IUser = await this.dao.findById(req.params.uid);
      if (existingUser == null) {
        res.status(404).json(ControllerErrors.USER_NOT_FOUND);
      } else {
        res.status(200).json(existingUser);
      }
    } catch (err) {
      next(err);
    }
  };
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user = new UserModel(
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
      const newUser: IUser = await this.dao.create(user);
      res.status(200).json(newUser);
    } catch (err) {
      next(err);
    }
  };
  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user = new UserModel(
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
      const updatedUser = await this.dao.update(req.params.uid, user);
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  };
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.dao.delete(req.body.uid);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
}
