import { ValidationComposite } from './ValidationComposite';
import { MissingParamError } from '../../errors';
import { Validation } from './Validation';

interface SutTypes {
  sut: ValidationComposite;
  validationStubs: Validation[];
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
  const validationStubs = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(validationStubs);

  return { sut, validationStubs };
};

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut();

    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    const error = sut.validate({ field: 'anyvalue' });

    expect(error).toEqual(new MissingParamError('field'));
  });

  it('should return the first error when more then one validations fails', () => {
    const { sut, validationStubs } = makeSut();

    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    const error = sut.validate({ field: 'anyvalue' });

    expect(error).toEqual(new Error());
  });

  it('should return falsy if validation pass', () => {
    const { sut } = makeSut();

    const error = sut.validate({ field: 'anyvalue' });

    expect(error).toBeFalsy();
  });
});
