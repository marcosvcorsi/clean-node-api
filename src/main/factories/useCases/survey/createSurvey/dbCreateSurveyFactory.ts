import { CreateSurvey } from '@/domain/useCases/CreateSurvey';
import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories/survey/SurveyMongoRepository';
import { DbCreateSurvey } from '@/data/useCases/createSurvey/DbCreateSurvey';

export const makeDbCreateSurvey = (): CreateSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository();

  return new DbCreateSurvey(surveyMongoRepository);
};
