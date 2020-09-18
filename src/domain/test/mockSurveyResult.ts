import { SurveyResultModel } from '../models/SurveyResult';
import { SaveSurveyResultParams } from '../useCases/survey-result/SaveSurveyResult';

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'accountId',
  answer: 'anyanswer',
  date: new Date(),
  surveyId: 'surveyId',
});

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'anysurveyid',
  question: 'anyquetion',
  answers: [
    {
      answer: 'anyanswer',
      count: 1,
      percent: 50,
      image: 'anyimage',
    },
    {
      answer: 'other',
      count: 1,
      percent: 50,
    },
  ],
  date: new Date(),
});
