import UserModel from '../models/users/User';
import { Express, NextFunction, Request, Response } from 'express';
import IController from './IController';
import IDao from '../daos/IDao';
import { ControllerErrors } from './ControllerErrors';
import IUser from '../models/users/IUser';
import { HttpStatusCode } from './HttpStatusCode';
import CustomError from '../shared/CustomError';

export class UserController implements IController {
  private readonly dao: IDao;

  public constructor(dao: IDao) {
    this.dao = dao;
    Object.freeze(this);
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
        const error: CustomError = new CustomError(
          HttpStatusCode.notFound,
          ControllerErrors.USER_NOT_FOUND,
          true
        );
        next(error);
      } else {
        res.status(HttpStatusCode.ok).json(existingUser);
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
    const data = { ...req.body, uid: req.params.uid };
    try {
      const newUser: IUser = await this.dao.create(data);
      res.status(HttpStatusCode.ok).json(newUser);
    } catch (err) {
      if (err instanceof CustomError) console.log(err.status);
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
      if (updatedUser == null) {
        const error: CustomError = new CustomError(
          HttpStatusCode.internalError,
          ControllerErrors.ERROR_UPDADING_USER,
          true
        );
        next(error);
      } else {
        res.status(HttpStatusCode.ok).json(updatedUser);
      }
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
      if (deletedUser == null) {
        const error: CustomError = new CustomError(
          HttpStatusCode.badRequest,
          ControllerErrors.USER_NOT_FOUND,
          true
        );
        next(error);
      } else {
        res.status(HttpStatusCode.ok).json(deletedUser);
      }
    } catch (err) {
      next(err);
    }
  };
}
