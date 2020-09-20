import { mockSurveyResultModel, throwError } from '@/domain/test';
import { serverError } from '@/presentation/helpers/http/httpHelper';
import { mockLoadSurveyById } from '@/presentation/test';
import {
  HttpRequest,
  SurveyResultModel,
  LoadSurveyResult,
  LoadSurveyById,
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
  loadSurveyByIdStub: LoadSurveyById;
  loadSurveyResultStub: LoadSurveyResult;
};

const makeSut = (): SutType => {
  const loadSurveyResultStub = mockLoadSurveyResult();
  const loadSurveyByIdStub = mockLoadSurveyById();

  const sut = new LoadSurveyResultController(
    loadSurveyByIdStub,
    loadSurveyResultStub,
  );

  return { sut, loadSurveyByIdStub, loadSurveyResultStub };
};

describe('LoadSurveyResultController', () => {
  it('should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

    await sut.handle(mockRequest());

    expect(loadSpy).toHaveBeenCalledWith('anyid');
  });

  it('should return server error if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockImplementationOnce(throwError);

    const response = await sut.handle(mockRequest());

    expect(response).toEqual(serverError(new Error()));
  });

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
