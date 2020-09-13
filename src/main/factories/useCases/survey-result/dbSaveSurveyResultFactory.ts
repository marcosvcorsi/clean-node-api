import { DbSaveSurveyResult } from '@/data/useCases/survey-result/saveSurveyResult/DbSaveSurveyResult';
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/repositories/survey-result/SurveyResultMongoRepository';

export const makeDbSaveSurveyResult = (): DbSaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository();

  return new DbSaveSurveyResult(surveyResultMongoRepository);
};
