import { SurveyModel } from '../../models/Survey';

export interface LoadSurveyById {
  loadById(id: string): Promise<SurveyModel>;
}
