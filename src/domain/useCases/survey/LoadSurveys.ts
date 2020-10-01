import { SurveyModel } from '../../models/Survey';

export interface LoadSurveys {
  load(accountId: string): Promise<SurveyModel[]>;
}
