import { SurveyResultModel } from '../models/SurveyResult';

export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>;

export interface SaveSurveyResult {
  save(data: SaveSurveyResultModel): Promise<SurveyResultModel>;
}
