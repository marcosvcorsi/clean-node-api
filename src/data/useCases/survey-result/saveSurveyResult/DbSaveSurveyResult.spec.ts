import MockDate from 'mockdate';
import {
  mockSaveSurveyResultParams,
  mockSurveyResultModel,
  throwError,
} from '@/domain/test';
import {
  mockLoadSurveyResultRepository,
  mockSaveSurveyResultRepository,
} from '@/data/test';
import {
  SaveSurveyResultRepository,
  LoadSurveyResultRepository,
} from './DbSaveSurveyResultProtocols';
import { DbSaveSurveyResult } from './DbSaveSurveyResult';

type SutType = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
};

const makeSut = (): SutType => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub,
  );

  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub,
  };
};

describe('DbSaveSurveyResult Test', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call SaveSurveyRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();

    const repositorySpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');

    const fakeSurveyResult = mockSaveSurveyResultParams();

    await sut.save(fakeSurveyResult);

    expect(repositorySpy).toHaveBeenCalledWith(fakeSurveyResult);
  });

  it('should throw an error if SaveSurveyRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();

    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockImplementationOnce(throwError);

    await expect(sut.save(mockSaveSurveyResultParams())).rejects.toThrow();
  });

  it('should return an survey result on success', async () => {
    const { sut } = makeSut();

    const response = await sut.save(mockSaveSurveyResultParams());

    expect(response).toEqual(mockSurveyResultModel());
  });

  it('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();

    const repositorySpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId',
    );

    const fakeSurveyResult = mockSaveSurveyResultParams();

    await sut.save(fakeSurveyResult);

    expect(repositorySpy).toHaveBeenCalledWith(
      fakeSurveyResult.surveyId,
      fakeSurveyResult.accountId,
    );
  });

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockImplementationOnce(throwError);

    const fakeSurveyResult = mockSaveSurveyResultParams();

    await expect(sut.save(fakeSurveyResult)).rejects.toThrow();
  });
});
