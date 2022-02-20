export default interface IDao<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T>;
  create(type: T): Promise<T>;
  update(id: string, type: T): Promise<T>;
  delete(id: string): Promise<T>;
}
