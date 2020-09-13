import { forbidden } from '@/presentation/helpers/http/httpHelper';
import { InvalidParamError } from '@/presentation/errors';
import {
  SurveyModel,
  HttpRequest,
  LoadSurveyById,
} from './SaveSurveyResultControllerProtocols';
import { SaveSurveyController } from './SaveSurveyResultController';

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'anyid',
  },
  body: {},
});

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

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(): Promise<SurveyModel> {
      return makeFakeSurvey();
    }
  }

  return new LoadSurveyByIdStub();
};

type SutType = {
  sut: SaveSurveyController;
  loadSurveyByIdStub: LoadSurveyById;
};

const makeSut = (): SutType => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const sut = new SaveSurveyController(loadSurveyByIdStub);

  return { sut, loadSurveyByIdStub };
};

describe('SaveSurveyController Test', () => {
  it('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

    const fakeRequest = makeFakeRequest();

    await sut.handle(fakeRequest);

    expect(loadSpy).toHaveBeenCalledWith('anyid');
  });

  it('should return forbidden if LoadSurveyById return null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(Promise.resolve(null));

    const response = await sut.handle(makeFakeRequest());

    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')));
  });
});
