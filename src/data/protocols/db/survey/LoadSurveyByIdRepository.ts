import { SurveyModel } from '@/domain/models/Survey';

export interface LoadSurveyByIdRepository {
  loadById(id: string): Promise<SurveyModel>;
}
