import { ValidationComposite } from './ValidationComposite';
import { MissingParamError } from '../../errors';
import { Validation } from './Validation';

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    class ValidationStub implements Validation {
      validate(input: object): Error {
        if (input) {
          return new MissingParamError('field');
        }

        return null;
      }
    }

    const validationStub = new ValidationStub();

    const sut = new ValidationComposite([validationStub]);

    const error = sut.validate({ field: 'anyvalue' });

    expect(error).toEqual(new MissingParamError('field'));
  });
});
