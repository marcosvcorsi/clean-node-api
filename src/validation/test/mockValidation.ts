import { MissingParamError } from '@/presentation/errors';
import { Validation } from '@/presentation/protocols';

export const mockValidation = (): Validation => {
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
