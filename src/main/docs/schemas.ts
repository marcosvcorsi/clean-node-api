import {
  accountSchema,
  errorSchema,
  loginParamsSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema,
  signUpParamsSchema,
  createSurveySchema,
  saveSurveyResultParamsSchema,
  surveyResultSchema,
  surveyResultAnswerSchema,
} from './schemas/';

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  createSurveyParams: createSurveySchema,
  saveSurveyResultParams: saveSurveyResultParamsSchema,
  error: errorSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  surveys: surveysSchema,
  surveyResult: surveyResultSchema,
  surveyResultAnswer: surveyResultAnswerSchema,
};
