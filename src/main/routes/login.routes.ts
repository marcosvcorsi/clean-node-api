import { Router } from 'express';
import { adaptRoute } from '../adapters/express/expressRouteAdapter';
import { makeSignUpController } from '../factories/signup/signUpFactory';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
};
