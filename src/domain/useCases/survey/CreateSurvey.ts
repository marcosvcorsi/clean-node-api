import { SurveyModel } from '../../models/Survey';

export type CreateSurveyModel = Omit<SurveyModel, 'id'>;

export interface CreateSurvey {
  create(data: CreateSurveyModel): Promise<void>;
}
