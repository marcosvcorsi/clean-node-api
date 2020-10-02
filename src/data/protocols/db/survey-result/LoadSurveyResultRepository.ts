import { SurveyResultModel } from '@/domain/models/SurveyResult';

export interface LoadSurveyResultRepository {
  loadBySurveyId(
    surveyId: string,
    accountId: string,
  ): Promise<SurveyResultModel>;
}
