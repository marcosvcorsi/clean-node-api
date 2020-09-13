import MockDate from 'mockdate';
import {
  badRequest,
  serverError,
  noContent,
} from '@/presentation/helpers/http/httpHelper';
import { throwError } from '@/domain/test';
import { mockCreateSurvey, mockValidation } from '@/presentation/test';
import { CreateSurveyController } from './CreateSurveyController';
import {
  Controller,
  HttpRequest,
  CreateSurvey,
  Validation,
} from './CreateSurveyControllerProtocols';

const mockRequest = (): HttpRequest => {
  return {
    body: {
      question: 'anyquestion',
      answers: [{ image: 'anyimage', answer: 'anyanswer' }],
      date: new Date(),
    },
  };
};

type SutType = {
  sut: Controller;
  validationStub: Validation;
  createSurveyStub: CreateSurvey;
};

const makeSut = (): SutType => {
  const validationStub = mockValidation();
  const createSurveyStub = mockCreateSurvey();

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

    const httpRequest = mockRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should throw an error if validation fails', async () => {
    const { sut, validationStub } = makeSut();

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());

    const httpReponse = await sut.handle(mockRequest());

    expect(httpReponse).toEqual(badRequest(new Error()));
  });

  it('should call CreateSurvey with correct values', async () => {
    const { sut, createSurveyStub } = makeSut();

    const createSurveySpy = jest.spyOn(createSurveyStub, 'create');

    const httpRequest = mockRequest();

    await sut.handle(httpRequest);

    expect(createSurveySpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should throw an error CreateSurvey if create throws', async () => {
    const { sut, createSurveyStub } = makeSut();

    jest.spyOn(createSurveyStub, 'create').mockImplementationOnce(throwError);

    const httpRequest = mockRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return noContent when create a survey', async () => {
    const { sut } = makeSut();

    const httpRequest = mockRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(noContent());
  });
});
