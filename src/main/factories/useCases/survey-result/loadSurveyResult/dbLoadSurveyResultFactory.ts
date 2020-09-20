import { DbLoadSurveyResult } from '@/data/useCases/survey-result/loadSurveyResult/DbLoadSurveyResult';
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/repositories/survey-result/SurveyResultMongoRepository';
import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories/survey/SurveyMongoRepository';

export const makeDbLoadSurveyResult = (): DbLoadSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository();
  const surveyMongoRepository = new SurveyMongoRepository();

  return new DbLoadSurveyResult(
    surveyResultMongoRepository,
    surveyMongoRepository,
  );
};
