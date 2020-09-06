import { Router } from 'express';
import { adaptRoute } from '../adapters/express/expressRouteAdapter';
import { makeSignUpController } from '../factories/controllers/user/signup/signUpControllerFactory';
import { makeLoginController } from '../factories/controllers/user/login/loginControllerFactory';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
  router.post('/login', adaptRoute(makeLoginController()));
};
