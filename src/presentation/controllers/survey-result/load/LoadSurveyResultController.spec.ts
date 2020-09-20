import { mockSurveyResultModel, throwError } from '@/domain/test';
import { serverError } from '@/presentation/helpers/http/httpHelper';
import {
  HttpRequest,
  SurveyResultModel,
  LoadSurveyResult,
} from './LoadSurveyResultControllerProtocols';
import { LoadSurveyResultController } from './LoadSurveyResultController';

const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load(): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }

  return new LoadSurveyResultStub();
};

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'anyid',
  },
});

type SutType = {
  sut: LoadSurveyResultController;
  loadSurveyResultStub: LoadSurveyResult;
};

const makeSut = (): SutType => {
  const loadSurveyResultStub = mockLoadSurveyResult();
  const sut = new LoadSurveyResultController(loadSurveyResultStub);

  return { sut, loadSurveyResultStub };
};

describe('LoadSurveyResultController', () => {
  it('should call LoadSurveyResult with correct value', async () => {
    const { sut, loadSurveyResultStub } = makeSut();

    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load');

    await sut.handle(mockRequest());

    expect(loadSpy).toHaveBeenCalledWith('anyid');
  });

  it('should return server error if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut();

    jest.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(throwError);

    const response = await sut.handle(mockRequest());

    expect(response).toEqual(serverError(new Error()));
  });
});
