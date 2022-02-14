import ITuitController from './ITuitController';
import { NextFunction, Request, Response } from 'express';
import ITuitDao from '../daos/ITuitDao';
import { HttpStatusCode } from './HttpStatusCode';

export default class TuitController implements ITuitController {
  private readonly dao: ITuitDao;
  public constructor(dao: ITuitDao) {
    this.dao = dao;
    Object.freeze(this);
  }
  findByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const tuit = await this.dao.findByUser(req.params.uid);
    res.status(HttpStatusCode.ok).json(tuit);
  };
  findAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const tuits = await this.dao.findAll();
    res.status(HttpStatusCode.ok).json(tuits);
  };
  findById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const tuit = await this.dao.findById(req.params.tid);
    res.status(HttpStatusCode.ok).json(tuit);
  };
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const tuit = await this.dao.create({ ...req.body, uid: req.params.uid });
    res.status(HttpStatusCode.ok).json(tuit);
  };
  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const updatedTuit = await this.dao.update(req.params.tid, req.body);
    res.status(HttpStatusCode.ok).json(updatedTuit);
  };
  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const deletedTuit = await this.dao.delete(req.params.tid);
    res.status(HttpStatusCode.ok).json(deletedTuit);
  };
}
