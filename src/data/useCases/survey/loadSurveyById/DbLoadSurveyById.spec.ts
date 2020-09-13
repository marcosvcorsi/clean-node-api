import MockDate from 'mockdate';
import { mockSurveyModel, throwError } from '@/domain/test';
import { mockLoadSurveyByIdRepository } from '@/data/test';
import { LoadSurveyByIdRepository } from './DbLoadSurveyByIdProtocols';
import { DbLoadSurveyById } from './DbLoadSurveyById';

type SutType = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutType => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
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

    expect(response).toEqual(mockSurveyModel());
  });

  it('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockImplementationOnce(throwError);

    await expect(sut.loadById('anyid')).rejects.toThrow();
  });
});
