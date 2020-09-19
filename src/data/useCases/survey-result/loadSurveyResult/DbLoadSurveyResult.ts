import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/LoadSurveyResultRepository';
import { LoadSurveyResult } from '@/domain/useCases/survey-result/LoadSurveyResult';
import { SurveyResultModel } from '../saveSurveyResult/DbSaveSurveyResultProtocols';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}

  async load(surveyId: string): Promise<SurveyResultModel> {
    await this.loadSurveyResultRepository.loadBySurveyId(surveyId);

    return null;
  }
}
