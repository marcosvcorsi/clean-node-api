import { SurveyModel } from '@/domain/models/Survey';

export interface LoadSurveysRepository {
  loadAll(accountId: string): Promise<SurveyModel[]>;
}
