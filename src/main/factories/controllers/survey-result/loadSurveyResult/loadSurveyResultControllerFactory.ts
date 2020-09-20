import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerDecoratorFactory';
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load/LoadSurveyResultController';
import { makeDbLoadSurveyById } from '@/main/factories/useCases/survey/loadSurveyById/dbLoadSurveyByIdFactory';
import { makeDbLoadSurveyResult } from '@/main/factories/useCases/survey-result/loadSurveyResult/dbLoadSurveyResultFactory';

export const makeLoadSurveyResultController = (): Controller => {
  const saveSurveyResultController = new LoadSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbLoadSurveyResult(),
  );

  return makeLogControllerDecorator(saveSurveyResultController);
};
