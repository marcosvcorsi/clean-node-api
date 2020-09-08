export interface SurveyAnswerModel {
  image?: string;
  answer: string;
}

export interface SurveyModel {
  id: string;
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
}
