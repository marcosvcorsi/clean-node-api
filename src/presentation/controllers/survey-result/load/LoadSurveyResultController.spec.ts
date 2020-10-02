import MockDate from 'mockdate';
import { mockSurveyResultModel, throwError } from '@/domain/test';
import {
  forbidden,
  ok,
  serverError,
} from '@/presentation/helpers/http/httpHelper';
import { mockLoadSurveyById, mockLoadSurveyResult } from '@/presentation/test';
import { InvalidParamError } from '@/presentation/errors';
import {
  HttpRequest,
  LoadSurveyResult,
  LoadSurveyById,
} from './LoadSurveyResultControllerProtocols';
import { LoadSurveyResultController } from './LoadSurveyResultController';

const mockRequest = (): HttpRequest => ({
  accountId: 'accountId',
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
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

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

  it('should return forbidden if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(null);

    const response = await sut.handle(mockRequest());

    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  it('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut();

    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load');

    await sut.handle(mockRequest());

    expect(loadSpy).toHaveBeenCalledWith('anyid', 'accountId');
  });

  it('should return server error if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut();

    jest.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(throwError);

    const response = await sut.handle(mockRequest());

    expect(response).toEqual(serverError(new Error()));
  });

  it('should return survey on success', async () => {
    const { sut } = makeSut();

    const response = await sut.handle(mockRequest());

    expect(response).toEqual(ok(mockSurveyResultModel()));
  });
});
