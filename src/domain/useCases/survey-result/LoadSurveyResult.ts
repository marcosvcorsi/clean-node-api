import { SurveyResultModel } from '../../models/SurveyResult';

export interface LoadSurveyResult {
  load(surveyId: string): Promise<SurveyResultModel>;
}
