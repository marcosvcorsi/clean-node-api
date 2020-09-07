import MockDate from 'mockdate';
import { CreateSurveyController } from './CreateSurveyController';
import {
  Controller,
  HttpRequest,
  CreateSurvey,
  Validation,
} from './CreateSurveyControllerProtocols';
import {
  badRequest,
  serverError,
  noContent,
} from '../../../helpers/http/httpHelper';

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      question: 'anyquestion',
      answers: [{ image: 'anyimage', answer: 'anyanswer' }],
      date: new Date(),
    },
  };
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeCreateSurvey = (): CreateSurvey => {
  class CreateSurveyStub implements CreateSurvey {
    async create(): Promise<void> {
      return Promise.resolve();
    }
  }

  return new CreateSurveyStub();
};

interface SutTypes {
  sut: Controller;
  validationStub: Validation;
  createSurveyStub: CreateSurvey;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const createSurveyStub = makeCreateSurvey();

  const sut = new CreateSurveyController(validationStub, createSurveyStub);

  return { sut, validationStub, createSurveyStub };
};

describe('Create Survey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should throw an error if validation fails', async () => {
    const { sut, validationStub } = makeSut();

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());

    const httpReponse = await sut.handle(makeFakeRequest());

    expect(httpReponse).toEqual(badRequest(new Error()));
  });

  it('should call CreateSurvey with correct values', async () => {
    const { sut, createSurveyStub } = makeSut();

    const createSurveySpy = jest.spyOn(createSurveyStub, 'create');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(createSurveySpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should throw an error CreateSurvey if create throws', async () => {
    const { sut, createSurveyStub } = makeSut();

    jest
      .spyOn(createSurveyStub, 'create')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return noContent when create a survey', async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(noContent());
  });
});
