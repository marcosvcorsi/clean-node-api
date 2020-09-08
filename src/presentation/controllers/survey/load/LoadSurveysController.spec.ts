import MockDate from 'mockdate';
import { SurveyModel, LoadSurveys } from './LoadSurveysControllerProtocols';
import { LoadSurveysController } from './LoadSurveysController';

const makeFakeSurveys = (): SurveyModel[] => [
  {
    id: 'anyid',
    question: 'anyquestion',
    date: new Date(),
    answers: [
      {
        answer: 'anyanswer',
      },
    ],
  },

  {
    id: 'otherid',
    question: 'otherquestion',
    date: new Date(),
    answers: [
      {
        answer: 'answer',
      },
      {
        answer: 'otheranswer',
        image: 'otherimage',
      },
    ],
  },
];

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return makeFakeSurveys();
    }
  }

  return new LoadSurveysStub();
};

interface SutType {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveys;
}

const makeSut = (): SutType => {
  const loadSurveysStub = makeLoadSurveys();
  const sut = new LoadSurveysController(loadSurveysStub);

  return { sut, loadSurveysStub };
};

describe('Load Survey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call LoadSurvey', async () => {
    const { sut, loadSurveysStub } = makeSut();

    const loadSpy = jest.spyOn(loadSurveysStub, 'load');

    await sut.handle({});

    expect(loadSpy).toHaveBeenCalled();
  });
});
