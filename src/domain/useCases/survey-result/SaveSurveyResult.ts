import { SurveyResultModel } from '../../models/SurveyResult';

export type SaveSurveyResultParams = Omit<SurveyResultModel, 'id'>;

export interface SaveSurveyResult {
  save(data: SaveSurveyResultParams): Promise<SurveyResultModel>;
}
