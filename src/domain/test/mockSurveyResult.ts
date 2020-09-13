import { SurveyResultModel } from '../models/SurveyResult';
import { SaveSurveyResultParams } from '../useCases/survey-result/SaveSurveyResult';

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'accountId',
  answer: 'anyanswer',
  date: new Date(),
  surveyId: 'surveyId',
});

export const mockSurveyResultModel = (): SurveyResultModel => ({
  id: 'anyid',
  ...mockSaveSurveyResultParams(),
});
