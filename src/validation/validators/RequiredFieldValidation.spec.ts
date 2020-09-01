import { RequiredFieldValidation } from './RequiredFieldValidation';
import { MissingParamError } from '../../presentation/errors';

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('anyfield');
};

describe('RequiredField Validation', () => {
  it('should return a MissingParamError if validation fails', () => {
    const sut = makeSut();

    const error = sut.validate({ otherField: 'anyotherfield' });

    expect(error).toEqual(new MissingParamError('anyfield'));
  });

  it('should return falsy valid when validation pass', () => {
    const sut = makeSut();

    const error = sut.validate({ anyfield: 'anyfield' });

    expect(error).toBeFalsy();
  });
});
