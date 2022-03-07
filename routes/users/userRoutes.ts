import { Request, Response, NextFunction, Router, Express } from 'express';
import ExpressValidatorIUser from '../../controllers/shared/ExpressValidatorIUser';
import IGenericController from '../../controllers/shared/IGenericController';
import IValidator from '../../controllers/shared/IValidator';
import IUser from '../../models/users/IUser';
import { adaptRequest as decoupleRequest } from '../adaptRoute';
import { handleCentralError } from '../handleCentralError';
import { validateNewUser } from './validateNewUser';

const router: Router = Router();
const path: string = '/api/v1';

export const configUserRoutes = (
  router: Router,
  app: Express,
  controller: IGenericController
) => {
  router.post('/users', validateNewUser, decoupleRequest(controller.create));
  router.get('/users', decoupleRequest(controller.findAll), handleCentralError);
  app.use(path, router);
};
