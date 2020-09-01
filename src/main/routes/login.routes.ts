import { Router } from 'express';
import { adaptRoute } from '../adapters/express/expressRouteAdapter';
import { makeSignUpController } from '../factories/controllers/signup/signUpControllerFactory';
import { makeLoginController } from '../factories/controllers/login/loginControllerFactory';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
  router.post('/login', adaptRoute(makeLoginController()));
};
