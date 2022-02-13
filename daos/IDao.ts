export default interface IDao {
  findAll(): Promise<any[]>;
  findById(uid: string): Promise<any>;
  create(data: any): Promise<any>;
  update(uid: string, data: any): Promise<any>;
  delete(data: any): Promise<any>;
}
