import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories/survey/SurveyMongoRepository';
import { DbLoadSurveyById } from '@/data/useCases/survey/loadSurveyById/DbLoadSurveyById';

export const makeDbLoadSurveyById = (): DbLoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository();

  return new DbLoadSurveyById(surveyMongoRepository);
};
