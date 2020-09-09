import { Router } from 'express';
import { adaptRoute } from '../adapters/express/expressRouteAdapter';
import { makeCreateSurveyController } from '../factories/controllers/survey/createSurvey/createSurveyControllerFactory';
import { makeLoadSurveysController } from '../factories/controllers/survey/loadSurveys/loadSurveysControllerFactory';
import { adminAuth } from '../middlewares/adminAuth';
import { auth } from '../middlewares/auth';

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeCreateSurveyController()));
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()));
};
