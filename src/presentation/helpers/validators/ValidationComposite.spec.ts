import { ValidationComposite } from './ValidationComposite';
import { MissingParamError } from '../../errors';
import { Validation } from './Validation';

interface SutTypes {
  sut: ValidationComposite;
  validationStub: Validation;
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: object): Error {
      if (!input) {
        return new MissingParamError('field');
      }

      return null;
    }
  }

  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new ValidationComposite([validationStub]);

  return { sut, validationStub };
};

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    const error = sut.validate({ field: 'anyvalue' });

    expect(error).toEqual(new MissingParamError('field'));
  });
});
