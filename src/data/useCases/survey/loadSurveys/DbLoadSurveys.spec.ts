import { mockLoadSurveysRepository } from '@/data/test';
import { mockSurveysModels, throwError } from '@/domain/test';
import MockDate from 'mockdate';
import { DbLoadSurveys } from './DbLoadSurveys';
import { LoadSurveysRepository } from './DbLoadSurveysProtocols';

type SutType = {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
};

const makeSut = (): SutType => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);

  return { sut, loadSurveysRepositoryStub };
};

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();

    const repositorySpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');

    const accountId = 'anyid';

    await sut.load(accountId);

    expect(repositorySpy).toHaveBeenCalledWith(accountId);
  });

  it('shoud return a list surveys on success', async () => {
    const { sut } = makeSut();

    const response = await sut.load('anyid');

    expect(response).toEqual(mockSurveysModels());
  });

  it('should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveysRepositoryStub, 'loadAll')
      .mockImplementationOnce(throwError);

    await expect(sut.load('anyid')).rejects.toThrow();
  });
});
