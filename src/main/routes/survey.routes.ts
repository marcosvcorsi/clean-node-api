import { Router } from 'express';
import { adaptRoute } from '../adapters/express/expressRouteAdapter';
import { makeCreateSurveyController } from '../factories/controllers/survey/createSurvey/createSurveyControllerFactory';
import { makeAuthMiddleware } from '../factories/middlewares/authMiddlewareFactory';
import { adaptMiddleware } from '../adapters/express/expressMiddlewareAdapter';

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));

  router.post('/surveys', adminAuth, adaptRoute(makeCreateSurveyController()));
};
