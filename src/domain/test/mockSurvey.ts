import { SurveyModel } from '../models/Survey';
import { CreateSurveyParams } from '../useCases/survey/CreateSurvey';

export const mockCreateSurveyParams = (): CreateSurveyParams => ({
  question: 'anyquestion',
  answers: [
    {
      image: 'anyimage',
      answer: 'anyanswer',
    },
  ],
  date: new Date(),
});

export const mockSurveyModel = (): SurveyModel => ({
  id: 'anyid',
  question: 'anyquestion',
  date: new Date(),
  answers: [
    {
      answer: 'anyanswer',
      image: 'anyimage',
    },
    {
      answer: 'otheranswer',
    },
  ],
});

export const mockSurveysModels = (): SurveyModel[] => [
  {
    id: 'anyid',
    question: 'anyquestion',
    date: new Date(),
    answers: [
      {
        answer: 'anyanswer',
      },
    ],
  },

  {
    id: 'otherid',
    question: 'otherquestion',
    date: new Date(),
    answers: [
      {
        answer: 'answer',
      },
      {
        answer: 'otheranswer',
        image: 'otherimage',
      },
    ],
  },
];
