import {
  SaveSurveyResult,
  SaveSurveyResultModel,
} from '@/domain/useCases/SaveSurveyResult';
import { SurveyResultModel } from '@/domain/models/SurveyResult';
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/SaveSurveyResultRepository';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
  ) {}

  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data);

    return null;
  }
}
