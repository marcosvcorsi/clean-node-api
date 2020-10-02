import { SurveyResultModel } from '../models/SurveyResult';
import { SaveSurveyResultParams } from '../useCases/survey-result/SaveSurveyResult';

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'accountId',
  answer: 'anyanswer',
  date: new Date(),
  surveyId: 'surveyId',
});

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'anyid',
  question: 'anyquestion',
  answers: [
    {
      answer: 'anyanswer',
      count: 0,
      percent: 0,
      image: 'anyimage',
      isCurrentAccountAnswer: false,
    },
    {
      answer: 'otheranswer',
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false,
    },
  ],
  date: new Date(),
});
