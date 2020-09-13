import { CreateSurveyParams } from '@/domain/useCases/survey/CreateSurvey';

export interface CreateSurveyRepository {
  create(surveyData: CreateSurveyParams): Promise<void>;
}
