import { mockSurveyModel, mockSurveysModels } from '@/domain/test';
import { CreateSurveyRepository } from '../protocols/db/survey/CreateSurveyRepository';
import { LoadSurveyByIdRepository } from '../protocols/db/survey/LoadSurveyByIdRepository';
import {
  LoadSurveysRepository,
  SurveyModel,
} from '../useCases/survey/loadSurveys/DbLoadSurveysProtocols';

export const mockCreateSurveyRepository = () => {
  class CreateSurveyRepositoryStub implements CreateSurveyRepository {
    create(): Promise<void> {
      return Promise.resolve();
    }
  }

  return new CreateSurveyRepositoryStub();
};

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(): Promise<SurveyModel> {
      return mockSurveyModel();
    }
  }

  return new LoadSurveyByIdRepositoryStub();
};

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return mockSurveysModels();
    }
  }

  return new LoadSurveysRepositoryStub();
};
