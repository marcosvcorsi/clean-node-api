import { SaveSurveyResultModel } from '@/domain/useCases/SaveSurveyResult';
import { SurveyResultModel } from '@/domain/models/SurveyResult';

export interface SaveSurveyResultRepository {
  save(surveyData: SaveSurveyResultModel): Promise<SurveyResultModel>;
}
