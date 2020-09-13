import { mockSurveyModel, mockSurveysModels } from '@/domain/test';
import {
  LoadSurveyById,
  SurveyModel,
} from '../controllers/survey-result/save/SaveSurveyResultControllerProtocols';
import { CreateSurvey } from '../controllers/survey/create/CreateSurveyControllerProtocols';
import { LoadSurveys } from '../controllers/survey/load/LoadSurveysControllerProtocols';

export const mockCreateSurvey = (): CreateSurvey => {
  class CreateSurveyStub implements CreateSurvey {
    async create(): Promise<void> {
      return Promise.resolve();
    }
  }

  return new CreateSurveyStub();
};

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(): Promise<SurveyModel> {
      return mockSurveyModel();
    }
  }

  return new LoadSurveyByIdStub();
};

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return mockSurveysModels();
    }
  }

  return new LoadSurveysStub();
};
