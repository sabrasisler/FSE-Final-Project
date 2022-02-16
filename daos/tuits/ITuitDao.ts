import IDao from '../IDao';

export default interface ITuitDao extends IDao {
  findByUser(uid: string): Promise<any>;
}
