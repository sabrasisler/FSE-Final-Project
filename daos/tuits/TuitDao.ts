import ITuitDao from './ITuitDao';
import { Model } from 'mongoose';
import ITuit from '../../models/tuits/ITuit';
import IErrorHandler from '../../errors/IErrorHandler';
import { TuitDaoErrors } from '../../errors/TuitDaoErrors';

export default class TuitDao implements ITuitDao {
  private readonly model: Model<ITuit>;
  private readonly errorHandler: IErrorHandler;
  public constructor(model: Model<ITuit>, errorHandler: IErrorHandler) {
    this.model = model;
    this.errorHandler = errorHandler;
  }

  findByUser = async (uid: string): Promise<ITuit> => {
    try {
      const tuit = await this.model.findOne({ author: uid }).populate('author');
      return this.errorHandler.sameObjectOrNullException(
        tuit,
        TuitDaoErrors.TUIT_NOT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.createError(
        TuitDaoErrors.DB_ERROR_FINDING_TUITS,
        err
      );
    }
  };
  findAll = async (): Promise<ITuit[]> => {
    console.log('called');
    try {
      return await this.model.find();
    } catch (err) {
      throw this.errorHandler.createError(
        TuitDaoErrors.DB_ERROR_FINDING_TUITS,
        err
      );
    }
  };
  findById = async (tid: string): Promise<ITuit> => {
    try {
      const tuit = await this.model.findById(tid);
      return this.errorHandler.sameObjectOrNullException(
        tuit,
        TuitDaoErrors.TUIT_NOT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.createError(
        TuitDaoErrors.DB_ERROR_FINDING_TUITS,
        err
      );
    }
  };
  create = async (tuit: ITuit): Promise<ITuit> => {
    try {
      const newTuit = await this.model.create({
        tuit,
      });
      newTuit.populate('author');
      return newTuit;
    } catch (err) {
      throw this.errorHandler.createError(TuitDaoErrors.DB_ERROR_CREATING_TUIT);
    }
  };
  update = async (tid: string, tuit: any): Promise<ITuit> => {
    try {
      const updatedTuit = await this.model.findOneAndUpdate(
        { _id: tid },
        tuit,
        {
          new: true,
        }
      );
      return this.errorHandler.sameObjectOrNullException(
        updatedTuit,
        TuitDaoErrors.TUIT_NOT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.createError(
        TuitDaoErrors.DB_ERROR_UPDATING_TUIT,
        err
      );
    }
  };
  delete = async (tid: string): Promise<ITuit> => {
    try {
      const deletedTuit = await this.model.findByIdAndDelete(tid);
      return this.errorHandler.sameObjectOrNullException(
        deletedTuit,
        TuitDaoErrors.TUIT_NOT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.createError(
        TuitDaoErrors.DB_ERROR_DELETING_TUIT,
        err
      );
    }
  };
}
