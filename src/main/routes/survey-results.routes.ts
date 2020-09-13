import { Router } from 'express';
import { adaptRoute } from '../adapters/express/expressRouteAdapter';
import { auth } from '../middlewares/auth';
import { makeSaveSurveyResultController } from '../factories/controllers/survey-result/saveSurveyResult/saveSurveyResultControllerFactory';

export default (router: Router): void => {
  router.put(
    '/surveys/:surveyId/results',
    auth,
    adaptRoute(makeSaveSurveyResultController()),
  );
};
