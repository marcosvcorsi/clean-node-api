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

  async load(surveyId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId,
    );

    if (!surveyResult) {
      await this.loadSurveyByIdRepository.loadById(surveyId);
    }

    return surveyResult;
  }
}
