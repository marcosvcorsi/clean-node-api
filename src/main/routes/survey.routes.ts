import { Router } from 'express';
import { adaptRoute } from '../adapters/express/expressRouteAdapter';
import { makeCreateSurveyController } from '../factories/controllers/survey/createSurvey/createSurveyControllerFactory';
import { makeAuthMiddleware } from '../factories/middlewares/authMiddlewareFactory';
import { adaptMiddleware } from '../adapters/express/expressMiddlewareAdapter';
import { makeLoadSurveysController } from '../factories/controllers/survey/loadSurveys/loadSurveysControllerFactory';

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));
  const auth = adaptMiddleware(makeAuthMiddleware());

  router.post('/surveys', adminAuth, adaptRoute(makeCreateSurveyController()));
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()));
};
