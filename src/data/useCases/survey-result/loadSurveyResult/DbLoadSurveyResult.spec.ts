import { mockLoadSurveyResultRepository } from '@/data/test';
import { mockSurveyResultModel, throwError } from '@/domain/test';
import { LoadSurveyResultRepository } from './DbLoadSurveyResultProtocols';
import { DbLoadSurveyResult } from './DbLoadSurveyResult';

type SutType = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
};

const makeSut = (): SutType => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);

  return { sut, loadSurveyResultRepositoryStub };
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
});
