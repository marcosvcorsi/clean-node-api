import MockDate from 'mockdate';
import {
  ok,
  serverError,
  noContent,
} from '@/presentation/helpers/http/httpHelper';
import { mockSurveysModels, throwError } from '@/domain/test';
import { mockLoadSurveys } from '@/presentation/test';
import { LoadSurveys } from './LoadSurveysControllerProtocols';
import { LoadSurveysController } from './LoadSurveysController';

type SutType = {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveys;
};

const makeSut = (): SutType => {
  const loadSurveysStub = mockLoadSurveys();
  const sut = new LoadSurveysController(loadSurveysStub);

  return { sut, loadSurveysStub };
};

describe('Load Survey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call LoadSurvey', async () => {
    const { sut, loadSurveysStub } = makeSut();

    const loadSpy = jest.spyOn(loadSurveysStub, 'load');

    await sut.handle();

    expect(loadSpy).toHaveBeenCalled();
  });

  it('shoud return ok on sucess', async () => {
    const { sut } = makeSut();

    const response = await sut.handle();

    expect(response).toEqual(ok(mockSurveysModels()));
  });

  it('shoud return no content when LoadSurveys is empty', async () => {
    const { sut, loadSurveysStub } = makeSut();

    jest
      .spyOn(loadSurveysStub, 'load')
      .mockReturnValueOnce(Promise.resolve([]));

    const response = await sut.handle();

    expect(response).toEqual(noContent());
  });

  it('shoud return server error on failed', async () => {
    const { sut, loadSurveysStub } = makeSut();

    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwError);

    const response = await sut.handle();

    expect(response).toEqual(serverError(new Error()));
  });
});
