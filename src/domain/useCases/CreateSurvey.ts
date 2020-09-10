import { SurveyAnswerModel } from '../models/Survey';

export type CreateSurveyModel = {
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
};

export interface CreateSurvey {
  create(data: CreateSurveyModel): Promise<void>;
}
