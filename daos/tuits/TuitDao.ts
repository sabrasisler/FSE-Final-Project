import ITuitDao from './ITuitDao';
import { Model } from 'mongoose';
import ITuit from '../../models/tuits/ITuit';
import ErrorHandler from '../../shared/ErrorHandler';
import { DaoErrors } from '../DaoErrors';

export default class TuitDao implements ITuitDao {
  private readonly model: Model<ITuit>;
  public constructor(model: Model<ITuit>) {
    this.model = model;
  }

  findByUser = async (uid: string): Promise<ITuit> => {
    try {
      const tuit = await this.model.findOne({ author: uid }).populate('author');
      return ErrorHandler.returnObjectOrNullError(
        tuit,
        DaoErrors.TUIT_NOT_FOUND
      );
    } catch (err) {
      throw ErrorHandler.createError(DaoErrors.DB_ERROR_FINDING_TUITS, err);
    }
  };
  findAll = async (): Promise<ITuit[]> => {
    try {
      return await this.model.find();
    } catch (err) {
      throw ErrorHandler.createError(DaoErrors.DB_ERROR_FINDING_TUITS, err);
    }
  };
  findById = async (tid: string): Promise<ITuit> => {
    try {
      const tuit = await this.model.findById(tid);
      return ErrorHandler.returnObjectOrNullError(
        tuit,
        DaoErrors.TUIT_NOT_FOUND
      );
    } catch (err) {
      throw ErrorHandler.createError(DaoErrors.DB_ERROR_FINDING_TUITS, err);
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
      throw ErrorHandler.createError(DaoErrors.DB_ERROR_CREATING_TUIT);
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
      return ErrorHandler.returnObjectOrNullError(
        updatedTuit,
        DaoErrors.TUIT_NOT_FOUND
      );
    } catch (err) {
      throw ErrorHandler.createError(DaoErrors.DB_ERROR_UPDATING_TUIT, err);
    }
  };
  delete = async (tid: string): Promise<ITuit> => {
    try {
      const deletedTuit = await this.model.findByIdAndDelete(tid);
      return ErrorHandler.returnObjectOrNullError(
        deletedTuit,
        DaoErrors.TUIT_NOT_FOUND
      );
    } catch (err) {
      throw ErrorHandler.createError(DaoErrors.DB_ERROR_DELETING_TUIT, err);
    }
  };
}
