import { CreateSurveyModel } from '@/domain/useCases/survey/CreateSurvey';

export interface CreateSurveyRepository {
  create(surveyData: CreateSurveyModel): Promise<void>;
}
