import { SaveSurveyResultParams } from '@/domain/useCases/survey-result/SaveSurveyResult';

export interface SaveSurveyResultRepository {
  save(surveyData: SaveSurveyResultParams): Promise<void>;
}
