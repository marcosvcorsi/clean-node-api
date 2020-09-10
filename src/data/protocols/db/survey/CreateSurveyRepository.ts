import { CreateSurveyModel } from '@/domain/useCases/CreateSurvey';

export interface CreateSurveyRepository {
  create(surveyData: CreateSurveyModel): Promise<void>;
}
