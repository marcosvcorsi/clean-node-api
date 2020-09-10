import { Controller } from '@/presentation/protocols';
import { LoadSurveysController } from '@/presentation/controllers/survey/load/LoadSurveysController';
import { makeLogControllerDecorator } from '../../../decorators/logControllerDecoratorFactory';
import { makeDbLoadSurveys } from '../../../useCases/survey/loadSurveys/dbLoadSurveysFactory';

export const makeLoadSurveysController = (): Controller => {
  const loadSurveysController = new LoadSurveysController(makeDbLoadSurveys());

  return makeLogControllerDecorator(loadSurveysController);
};
