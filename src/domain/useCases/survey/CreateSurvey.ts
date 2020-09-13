import { SurveyModel } from '../../models/Survey';

export type CreateSurveyParams = Omit<SurveyModel, 'id'>;

export interface CreateSurvey {
  create(data: CreateSurveyParams): Promise<void>;
}
