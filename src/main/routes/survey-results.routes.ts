import { Router } from 'express';
import { adaptRoute } from '../adapters/express/expressRouteAdapter';
import { auth } from '../middlewares/auth';
import { makeSaveSurveyResultController } from '../factories/controllers/survey-result/saveSurveyResult/saveSurveyResultControllerFactory';
import { makeLoadSurveyResultController } from '../factories/controllers/survey-result/loadSurveyResult/loadSurveyResultControllerFactory';

export default (router: Router): void => {
  router.put(
    '/surveys/:surveyId/results',
    auth,
    adaptRoute(makeSaveSurveyResultController()),
  );

  router.get(
    '/surveys/:surveyId/results',
    auth,
    adaptRoute(makeLoadSurveyResultController()),
  );
};
