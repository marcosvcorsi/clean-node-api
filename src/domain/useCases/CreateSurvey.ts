export interface SurveyAnswer {
  answer: string;
  image?: string;
}

export interface CreateSurveyModel {
  question: string;
  answers: SurveyAnswer[];
}

export interface CreateSurvey {
  create(data: CreateSurveyModel): Promise<void>;
}
