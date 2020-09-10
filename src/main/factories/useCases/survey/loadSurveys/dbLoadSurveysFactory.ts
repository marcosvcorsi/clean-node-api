import { LoadSurveys } from '@/domain/useCases/LoadSurveys';
import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories/survey/SurveyMongoRepository';
import { DbLoadSurveys } from '@/data/useCases/loadSurveys/DbLoadSurveys';

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository();

  return new DbLoadSurveys(surveyMongoRepository);
};
