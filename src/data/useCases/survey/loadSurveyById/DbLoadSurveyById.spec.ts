import MockDate from 'mockdate';
import {
  LoadSurveyByIdRepository,
  SurveyModel,
} from './DbLoadSurveyByIdProtocols';
import { DbLoadSurveyById } from './DbLoadSurveyById';

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

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(): Promise<SurveyModel> {
      return makeFakeSurvey();
    }
  }

  return new LoadSurveyByIdRepositoryStub();
};

type SutType = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutType => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);

  return { sut, loadSurveyByIdRepositoryStub };
};

describe('DbLoadSurveyById Test', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();

    const repositorySpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');

    await sut.loadById('anyid');

    expect(repositorySpy).toHaveBeenCalledWith('anyid');
  });

  it('should return null if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(null);

    const response = await sut.loadById('anyid');

    expect(response).toBeNull();
  });

  it('shoud return a survey by id on success', async () => {
    const { sut } = makeSut();

    const response = await sut.loadById('anyid');

    expect(response).toEqual(makeFakeSurvey());
  });

  it('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(Promise.reject(new Error()));

    await expect(sut.loadById('anyid')).rejects.toThrow();
  });
});
