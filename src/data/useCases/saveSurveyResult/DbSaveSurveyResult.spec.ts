import MockDate from 'mockdate';
import { SurveyResultModel } from '@/domain/models/SurveyResult';
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/SaveSurveyResultRepository';
import { DbSaveSurveyResult } from './DbSaveSurveyResult';

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'anyid',
  accountId: 'accountId',
  answer: 'anyanswer',
  date: new Date(),
  surveyId: 'surveyId',
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

    const fakeSurveyResult = makeFakeSurveyResult();

    await sut.save(fakeSurveyResult);

    expect(repositorySpy).toHaveBeenCalledWith(fakeSurveyResult);
  });
});
