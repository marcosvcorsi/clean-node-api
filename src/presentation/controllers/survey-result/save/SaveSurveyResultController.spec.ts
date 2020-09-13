import MockDate from 'mockdate';
import {
  forbidden,
  serverError,
  ok,
} from '@/presentation/helpers/http/httpHelper';
import { InvalidParamError } from '@/presentation/errors';
import {
  SurveyModel,
  HttpRequest,
  LoadSurveyById,
  SaveSurveyResult,
  SurveyResultModel,
} from './SaveSurveyResultControllerProtocols';
import { SaveSurveyController } from './SaveSurveyResultController';

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'anyid',
  },
  body: {
    answer: 'anyanswer',
  },
  accountId: 'anyaccount',
});

const makeFakeSurvey = () => ({
  id: 'anyid',
  question: 'anyquestion',
  date: new Date(),
  answers: [
    {
      answer: 'anyanswer',
    },
  ],
});

const makeFakeSurveyResult = (): SurveyResultModel => ({
  accountId: 'anyaccount',
  surveyId: 'anysurvey',
  answer: 'anyanswer',
  date: new Date(),
  id: 'anyid',
});

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(): Promise<SurveyResultModel> {
      return makeFakeSurveyResult();
    }
  }

  return new SaveSurveyResultStub();
};

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(): Promise<SurveyModel> {
      return makeFakeSurvey();
    }
  }

  return new LoadSurveyByIdStub();
};

type SutType = {
  sut: SaveSurveyController;
  loadSurveyByIdStub: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
};

const makeSut = (): SutType => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const saveSurveyResultStub = makeSaveSurveyResult();
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

    const fakeRequest = makeFakeRequest();

    await sut.handle(fakeRequest);

    expect(loadSpy).toHaveBeenCalledWith('anyid');
  });

  it('should return forbidden if LoadSurveyById return null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(Promise.resolve(null));

    const response = await sut.handle(makeFakeRequest());

    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  it('should return serverError if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const response = await sut.handle(makeFakeRequest());

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

    const fakeRequest = makeFakeRequest();

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

    jest
      .spyOn(saveSurveyResultStub, 'save')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const response = await sut.handle(makeFakeRequest());

    expect(response).toEqual(serverError(new Error()));
  });

  it('should return a survey result on success', async () => {
    const { sut } = makeSut();

    const response = await sut.handle(makeFakeRequest());

    expect(response).toEqual(ok(makeFakeSurveyResult()));
  });
});
