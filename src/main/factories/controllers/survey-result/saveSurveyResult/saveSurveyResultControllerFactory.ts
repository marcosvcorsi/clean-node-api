import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerDecoratorFactory';
import { SaveSurveyController } from '@/presentation/controllers/survey-result/save/SaveSurveyResultController';
import { makeDbLoadSurveyById } from '@/main/factories/useCases/survey/loadSurveyById/dbLoadSurveyByIdFactory';
import { makeDbSaveSurveyResult } from '@/main/factories/useCases/survey-result/saveSurveyResult/dbSaveSurveyResultFactory';

export const makeSaveSurveyResultController = (): Controller => {
  const saveSurveyResultController = new SaveSurveyController(
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult(),
  );

  return makeLogControllerDecorator(saveSurveyResultController);
};
