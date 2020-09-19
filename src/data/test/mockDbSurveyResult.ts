import { mockSurveyResultModel } from '@/domain/test';
import { LoadSurveyResultRepository } from '../protocols/db/survey-result/LoadSurveyResultRepository';
import { SaveSurveyResultRepository } from '../protocols/db/survey-result/SaveSurveyResultRepository';
import { SurveyResultModel } from '../useCases/survey-result/saveSurveyResult/DbSaveSurveyResultProtocols';

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(): Promise<void> {
      return Promise.resolve();
    }
  }

  return new SaveSurveyResultRepositoryStub();
};

export const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId(): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }

  return new LoadSurveyResultRepositoryStub();
};
