export interface SurveyAnswer {
  question: string;
  image?: string;
}

export interface CreateSurveyModel {
  question: string;
  answers: SurveyAnswer[];
}

export interface CreateSurvey {
  create(data: CreateSurveyModel): Promise<void>;
}
