import { SaveSurveyResultModel } from '@/domain/useCases/survey-result/SaveSurveyResult';
import { SurveyResultModel } from '@/domain/models/SurveyResult';

export interface SaveSurveyResultRepository {
  save(surveyData: SaveSurveyResultModel): Promise<SurveyResultModel>;
}
