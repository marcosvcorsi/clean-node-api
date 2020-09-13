import MockDate from 'mockdate';
import {
  forbidden,
  serverError,
  ok,
} from '@/presentation/helpers/http/httpHelper';
import { InvalidParamError } from '@/presentation/errors';
import { mockSurveyResultModel, throwError } from '@/domain/test';
import { mockSaveSurveyResult, mockLoadSurveyById } from '@/presentation/test';

import {
  HttpRequest,
  LoadSurveyById,
  SaveSurveyResult,
} from './SaveSurveyResultControllerProtocols';
import { SaveSurveyController } from './SaveSurveyResultController';

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'anyid',
  },
  body: {
    answer: 'anyanswer',
  },
  accountId: 'anyaccount',
});

type SutType = {
  sut: SaveSurveyController;
  loadSurveyByIdStub: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
};

const makeSut = (): SutType => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const saveSurveyResultStub = mockSaveSurveyResult();
  const sut = new SaveSurveyController(
    loadSurveyByIdStub,
    saveSurveyResultStub,
  );

  return { sut, loadSurveyByIdStub, saveSurveyResultStub };
};

describe('SaveSurveyController Test', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

    const fakeRequest = mockRequest();

    await sut.handle(fakeRequest);

    expect(loadSpy).toHaveBeenCalledWith('anyid');
  });

  it('should return forbidden if LoadSurveyById return null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(Promise.resolve(null));

    const response = await sut.handle(mockRequest());

    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  it('should return serverError if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockImplementationOnce(throwError);

    const response = await sut.handle(mockRequest());

    expect(response).toEqual(serverError(new Error()));
  });

  it('should return forbidden if an invalid answer is provided', async () => {
    const { sut } = makeSut();

    const invalidAnswerRequest = {
      params: {
        surveyId: 'anyid',
      },
      body: {
        answer: 'invalid_answer',
      },
    };

    const response = await sut.handle(invalidAnswerRequest);

    expect(response).toEqual(forbidden(new InvalidParamError('answer')));
  });

  it('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut();

    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save');

    const fakeRequest = mockRequest();

    await sut.handle(fakeRequest);

    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'anyid',
      accountId: 'anyaccount',
      date: new Date(),
      answer: 'anyanswer',
    });
  });

  it('should return serverError if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut();

    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError);

    const response = await sut.handle(mockRequest());

    expect(response).toEqual(serverError(new Error()));
  });

  it('should return a survey result on success', async () => {
    const { sut } = makeSut();

    const response = await sut.handle(mockRequest());

    expect(response).toEqual(ok(mockSurveyResultModel()));
  });
});
