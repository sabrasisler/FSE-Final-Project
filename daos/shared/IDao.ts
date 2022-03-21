/**
 * Represents the generic operations of a DAO. The DAO acts as a layer of abstraction between the controller and the database by performing all the database-related operations.
 */
export default interface IDao<T> {
  findAll(): Promise<T[]>;
  findById(field: string): Promise<T>;
  exists(resource: T): Promise<boolean>;
  create(type: T): Promise<T>;
  update(id: string, type: T): Promise<T>;
  delete(id: string): Promise<any>;
}
