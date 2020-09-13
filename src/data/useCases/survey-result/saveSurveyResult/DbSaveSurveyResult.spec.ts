import MockDate from 'mockdate';
import {
  mockSaveSurveyResultParams,
  mockSurveyResultModel,
  throwError,
} from '@/domain/test';
import { mockSaveSurveyResultRepository } from '@/data/test';
import { SaveSurveyResultRepository } from './DbSaveSurveyResultProtocols';
import { DbSaveSurveyResult } from './DbSaveSurveyResult';

type SutType = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeSut = (): SutType => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);

  return { sut, saveSurveyResultRepositoryStub };
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
});
