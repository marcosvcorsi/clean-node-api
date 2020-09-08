import { SurveyModel } from '../../../../domain/models/Survey';

export interface LoadSurveysRepository {
  loadAll(): Promise<SurveyModel[]>;
}
