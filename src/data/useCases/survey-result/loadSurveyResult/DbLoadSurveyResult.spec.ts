import {
  mockLoadSurveyByIdRepository,
  mockLoadSurveyResultRepository,
} from '@/data/test';
import { mockSurveyResultModel, throwError } from '@/domain/test';
import {
  LoadSurveyResultRepository,
  LoadSurveyByIdRepository,
} from './DbLoadSurveyResultProtocols';
import { DbLoadSurveyResult } from './DbLoadSurveyResult';

type SutType = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutType => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();

  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub,
  );

  return { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub };
};

describe('DbLoadSurveyResult UseCase', () => {
  it('should LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();

    const repositorySpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId',
    );

    await sut.load('anyid');

    expect(repositorySpy).toHaveBeenCalledWith('anyid');
  });

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockImplementationOnce(throwError);

    await expect(sut.load('anyid')).rejects.toThrow();
  });

  it('should return an survey result on success', async () => {
    const { sut } = makeSut();

    const response = await sut.load('anyid');

    expect(response).toEqual(mockSurveyResultModel());
  });

  it('should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const {
      sut,
      loadSurveyResultRepositoryStub,
      loadSurveyByIdRepositoryStub,
    } = makeSut();

    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(null));

    const repositorySpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');

    await sut.load('anyid');

    expect(repositorySpy).toHaveBeenCalledWith('anyid');
  });

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const {
      sut,
      loadSurveyResultRepositoryStub,
      loadSurveyByIdRepositoryStub,
    } = makeSut();

    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(null));

    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockImplementationOnce(throwError);

    await expect(sut.load('anyid')).rejects.toThrow();
  });
});
