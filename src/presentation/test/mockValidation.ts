import { Validation } from '../protocols';

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: object): Error {
      return input ? null : new Error();
    }
  }

  return new ValidationStub();
};
