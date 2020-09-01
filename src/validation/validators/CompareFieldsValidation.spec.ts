import { InvalidParamError } from '../../presentation/errors';
import { CompareFieldsValidation } from './CompareFieldsValidation';

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('anyfield', 'otherfield');
};

describe('CompareFields Validation', () => {
  it('should return a InvalidParamError if validation fails', () => {
    const sut = makeSut();

    const error = sut.validate({
      anyfield: 'anyfield',
      otherfield: 'otherfield',
    });

    expect(error).toEqual(new InvalidParamError('otherfield'));
  });

  it('should return falsy valid when validation pass', () => {
    const sut = makeSut();

    const error = sut.validate({
      anyfield: 'anyfield',
      otherfield: 'anyfield',
    });

    expect(error).toBeFalsy();
  });
});
