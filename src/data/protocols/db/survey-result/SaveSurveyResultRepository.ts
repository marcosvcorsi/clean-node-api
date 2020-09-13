import { SaveSurveyResultParams } from '@/domain/useCases/survey-result/SaveSurveyResult';
import { SurveyResultModel } from '@/domain/models/SurveyResult';

export interface SaveSurveyResultRepository {
  save(surveyData: SaveSurveyResultParams): Promise<SurveyResultModel>;
}
