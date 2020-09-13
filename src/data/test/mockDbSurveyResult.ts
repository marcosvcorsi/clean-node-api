import { mockSurveyResultModel } from '@/domain/test';
import { SaveSurveyResultRepository } from '../protocols/db/survey-result/SaveSurveyResultRepository';
import { SurveyResultModel } from '../useCases/survey-result/saveSurveyResult/DbSaveSurveyResultProtocols';

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }

  return new SaveSurveyResultRepositoryStub();
};
