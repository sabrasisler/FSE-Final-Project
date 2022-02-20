import ITuit from '../../models/tuits/ITuit';
import IDao from '../IDao';

export default interface ITuitDao extends IDao<ITuit> {
  findByUser(uid: string): Promise<ITuit>;
}
