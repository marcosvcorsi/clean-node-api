import { mockSurveyResultModel } from '@/domain/test';
import { LoadSurveyResult } from '../controllers/survey-result/load/LoadSurveyResultControllerProtocols';
import {
  SaveSurveyResult,
  SurveyResultModel,
} from '../controllers/survey-result/save/SaveSurveyResultControllerProtocols';

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }

  return new SaveSurveyResultStub();
};

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load(): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }

  return new LoadSurveyResultStub();
};
