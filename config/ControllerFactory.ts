import { Express } from 'express';
import IBaseController from '../controllers/IBaseController';
import IDao from '../daos/IDao';
export default class CrtlFactory {
  private static controllerMap = new Map<string, IBaseController>();
  public static getInstance<T, U, V>(
    key: string,
    controller: { new (dao: T): IBaseController },
    dao: T
  ): IBaseController {
    // if (!Object.values<string>(ApiTypes).includes(key)) {
    //   throw new Error('Invalid key');
    // }
    if (!CrtlFactory.controllerMap.has(key)) {
      CrtlFactory.controllerMap.set(key, new controller(dao));
    }
    const newController: IBaseController | undefined =
      CrtlFactory.controllerMap.get(key);
    if (newController === undefined) {
      throw new Error('Not found');
    } else {
      return newController;
    }
  }
}
