import MockDate from 'mockdate';
import { DbCreateSurvey } from './DbCreateSurvey';
import {
  CreateSurveyRepository,
  CreateSurveyModel,
} from './DbCreateSurveyProtocols';

const makeCreateSurveyRepository = () => {
  class CreateSurveyRepositoryStub implements CreateSurveyRepository {
    create(): Promise<void> {
      return Promise.resolve();
    }
  }

  return new CreateSurveyRepositoryStub();
};

interface SutType {
  sut: DbCreateSurvey;
  createSurveyRepositoryStub: CreateSurveyRepository;
}

const makeSut = (): SutType => {
  const createSurveyRepositoryStub = makeCreateSurveyRepository();
  const sut = new DbCreateSurvey(createSurveyRepositoryStub);

  return { sut, createSurveyRepositoryStub };
};

const makeFakeSurvey = (): CreateSurveyModel => ({
  question: 'anyquestion',
  answers: [
    {
      image: 'anyimage',
      answer: 'anyanswer',
    },
  ],
  date: new Date(),
});

describe('DbCreateSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call CreateSurveyRepository with correct values', async () => {
    const { sut, createSurveyRepositoryStub } = makeSut();

    const repositorySpy = jest.spyOn(createSurveyRepositoryStub, 'create');

    const fakeSurvey = makeFakeSurvey();

    await sut.create(fakeSurvey);

    expect(repositorySpy).toHaveBeenCalledWith(fakeSurvey);
  });

  it('should throw an error if CreateSurveyRepository throws', async () => {
    const { sut, createSurveyRepositoryStub } = makeSut();

    jest
      .spyOn(createSurveyRepositoryStub, 'create')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const fakeSurvey = makeFakeSurvey();

    await expect(sut.create(fakeSurvey)).rejects.toThrow();
  });
});
