import { CreateSurveyController } from './CreateSurveyController';
import { Controller, HttpRequest } from './CreateSurveyControllerProtocols';
import { Validation } from '../../../protocols';

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      question: 'anyquestion',
      answers: [{ image: 'anyimage', answer: 'anyanswer' }],
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

interface SutTypes {
  sut: Controller;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();

  const sut = new CreateSurveyController(validationStub);

  return { sut, validationStub };
};

describe('Create Survey Controller', () => {
  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
