import MockDate from 'mockdate';
import { SurveyResultModel } from '@/domain/models/SurveyResult';
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/SaveSurveyResultRepository';
import { SaveSurveyResultModel } from '@/domain/useCases/SaveSurveyResult';
import { DbSaveSurveyResult } from './DbSaveSurveyResult';

const makeFakeSurveyData = (): SaveSurveyResultModel => ({
  accountId: 'accountId',
  answer: 'anyanswer',
  date: new Date(),
  surveyId: 'surveyId',
});

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'anyid',
  ...makeFakeSurveyData(),
});

const makeSaveSurveyResultRepository = () => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(): Promise<SurveyResultModel> {
      return makeFakeSurveyResult();
    }
  }

  return new SaveSurveyResultRepositoryStub();
};

type SutType = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeSut = (): SutType => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository();
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

    const fakeSurveyResult = makeFakeSurveyData();

    await sut.save(fakeSurveyResult);

    expect(repositorySpy).toHaveBeenCalledWith(fakeSurveyResult);
  });

  it('should throw an error if SaveSurveyRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();

    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockReturnValueOnce(Promise.reject(new Error()));

    await expect(sut.save(makeFakeSurveyData())).rejects.toThrow();
  });

  it('should return an survey result on success', async () => {
    const { sut } = makeSut();

    const response = await sut.save(makeFakeSurveyData());

    expect(response).toEqual(makeFakeSurveyResult());
  });
});
