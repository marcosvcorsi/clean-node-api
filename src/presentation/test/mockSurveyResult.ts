import { mockSurveyResultModel } from '@/domain/test';
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
