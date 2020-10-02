import {
  LoadSurveyResultRepository,
  LoadSurveyByIdRepository,
  LoadSurveyResult,
  SurveyResultModel,
} from './DbLoadSurveyResultProtocols';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}

  async load(surveyId: string, accountId: string): Promise<SurveyResultModel> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId,
      accountId,
    );

    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId);

      surveyResult = {
        surveyId,
        question: survey.question,
        date: survey.date,
        answers: survey.answers.map(answer => {
          return {
            ...answer,
            count: 0,
            percent: 0,
            isCurrentAccountAnswer: false,
          };
        }),
      };
    }

    return surveyResult;
  }
}
