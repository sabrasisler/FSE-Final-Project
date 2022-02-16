import ITuitDao from './ITuitDao';
import { Model } from 'mongoose';
import ITuit from '../../models/tuits/ITuit';

export default class TuitDao implements ITuitDao {
  private readonly model: Model<ITuit>;
  public constructor(model: Model<ITuit>) {
    this.model = model;
  }
  findByUser = async (uid: string): Promise<ITuit | null> => {
    return await this.model.findOne({ author: uid }).populate('author');
  };
  findAll = async (): Promise<ITuit[]> => {
    return await this.model.find();
  };
  findById = async (tid: string): Promise<ITuit | null> => {
    return this.model.findById(tid);
  };
  update = async (tid: string, tuit: any): Promise<ITuit | null> => {
    return await this.model.findOneAndUpdate({ _id: tid }, tuit, {
      new: true,
    });
  };
  delete = async (tid: string): Promise<ITuit | null> => {
    return await this.model.findByIdAndDelete(tid);
  };

  create = async (tuit: any): Promise<ITuit> => {
    return await (
      await this.model.create({ ...tuit, author: tuit.uid })
    ).populate('author');
  };
}
