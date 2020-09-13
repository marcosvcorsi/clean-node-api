import { mockCreateSurveyRepository } from '@/data/test';
import { mockCreateSurveyParams, throwError } from '@/domain/test';
import MockDate from 'mockdate';
import { DbCreateSurvey } from './DbCreateSurvey';
import { CreateSurveyRepository } from './DbCreateSurveyProtocols';

type SutType = {
  sut: DbCreateSurvey;
  createSurveyRepositoryStub: CreateSurveyRepository;
};

const makeSut = (): SutType => {
  const createSurveyRepositoryStub = mockCreateSurveyRepository();
  const sut = new DbCreateSurvey(createSurveyRepositoryStub);

  return { sut, createSurveyRepositoryStub };
};

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

    const fakeSurvey = mockCreateSurveyParams();

    await sut.create(fakeSurvey);

    expect(repositorySpy).toHaveBeenCalledWith(fakeSurvey);
  });

  it('should throw an error if CreateSurveyRepository throws', async () => {
    const { sut, createSurveyRepositoryStub } = makeSut();

    jest
      .spyOn(createSurveyRepositoryStub, 'create')
      .mockImplementationOnce(throwError);

    const fakeSurvey = mockCreateSurveyParams();

    await expect(sut.create(fakeSurvey)).rejects.toThrow();
  });
});
