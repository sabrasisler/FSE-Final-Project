import INotification from '../../models/notifications/INotification';
import IDao from '../shared/IDao';

/**
 *  DAO operations for the notifications resource. Extends the generic {@link IDao} interface.
 */
export default interface ITuitDao extends IDao<INotification> {
  findByUser(uid: string): Promise<INotification[]>;
}