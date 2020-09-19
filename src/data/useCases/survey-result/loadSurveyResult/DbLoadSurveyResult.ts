import {
  LoadSurveyResultRepository,
  LoadSurveyResult,
  SurveyResultModel,
} from './DbLoadSurveyResultProtocols';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}

  async load(surveyId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId,
    );

    return surveyResult;
  }
}
