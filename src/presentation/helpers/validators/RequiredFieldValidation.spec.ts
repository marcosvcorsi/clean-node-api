import { RequiredFieldValidation } from './RequiredFieldValidation';
import { MissingParamError } from '../../errors';

describe('RequiredField Validation', () => {
  it('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('anyfield');

    const error = sut.validate({ otherField: 'anyotherfield' });

    expect(error).toEqual(new MissingParamError('anyfield'));
  });
});
