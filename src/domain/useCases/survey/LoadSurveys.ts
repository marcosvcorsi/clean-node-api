import { SurveyModel } from '../../models/Survey';

export interface LoadSurveys {
  load(): Promise<SurveyModel[]>;
}
