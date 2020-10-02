import {
  SaveSurveyResultRepository,
  SurveyResultModel,
  SaveSurveyResult,
  SaveSurveyResultParams,
  LoadSurveyResultRepository,
} from './DbSaveSurveyResultProtocols';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}

  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data);

    const { surveyId, accountId } = data;

    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId,
      accountId,
    );

    return surveyResult;
  }
}
