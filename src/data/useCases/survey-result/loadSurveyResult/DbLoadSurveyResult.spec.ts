import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/LoadSurveyResultRepository';
import { mockSurveyResultModel, throwError } from '@/domain/test';
import { SurveyResultModel } from '../saveSurveyResult/DbSaveSurveyResultProtocols';
import { DbLoadSurveyResult } from './DbLoadSurveyResult';

const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId(): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }

  return new LoadSurveyResultRepositoryStub();
};

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
});
