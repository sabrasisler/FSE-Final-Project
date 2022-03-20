import ITuit from '../../models/tuits/ITuit';
import IDao from '../shared/IDao';

/**
 * Additional DAO operation for the tuits resource. Extends the generic {@link IDao} interface.
 */
export default interface ITuitDao extends IDao<ITuit> {
  findByUser(uid: string): Promise<ITuit[]>;
}
