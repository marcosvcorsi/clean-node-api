import { surveysPath, surveyResultPath, signUpPath, loginPath } from './paths/';

export default {
  '/login': loginPath,
  '/signup': signUpPath,
  '/surveys': surveysPath,
  '/surveys/{survey_id}/results': surveyResultPath,
};
