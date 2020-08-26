import SignUpController from './SignUpController';

import {
  CreateAccount,
  CreateAccountModel,
  AccountModel,
  Validation,
} from './SignUpControllerProtocols';

import { ServerError, MissingParamError } from '../../errors';
import { HttpRequest } from '../../protocols';
import {
  created,
  badRequest,
  serverError,
} from '../../helpers/http/httpHelper';

interface SutType {
  sut: SignUpController;
  createAccountStub: CreateAccount;
  validationStub: Validation;
}

const makeCreateAccount = (): CreateAccount => {
  class CreateAccountStub implements CreateAccount {
    async create(account: CreateAccountModel): Promise<AccountModel> {
      const { name, email, password } = account;

      const fakeCreateAccount = {
        id: 'valid_id',
        name,
        email,
        password,
      };

      return Promise.resolve(fakeCreateAccount);
    }
  }

  return new CreateAccountStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: object): Error {
      return input ? null : new Error();
    }
  }

  return new ValidationStub();
};

const makeSut = (): SutType => {
  const createAccountStub = makeCreateAccount();
  const validationStub = makeValidation();

  const sut = new SignUpController(createAccountStub, validationStub);

  return {
    sut,
    createAccountStub,
    validationStub,
  };
};

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      name: 'anyname',
      email: 'anyemail@mail.com',
      password: 'anypassword',
      passwordConfirmation: 'anypassword',
    },
  };
};

describe('SignUp Controller', () => {
  it('should call CreateAccount with correct values', async () => {
    const { sut, createAccountStub } = makeSut();

    const createAccountSpy = jest.spyOn(createAccountStub, 'create');

    await sut.handle(makeFakeRequest());

    expect(createAccountSpy).toHaveBeenCalledWith({
      name: 'anyname',
      email: 'anyemail@mail.com',
      password: 'anypassword',
    });
  });

  it('should return an server error if CreateAccount throws', async () => {
    const { sut, createAccountStub } = makeSut();

    jest.spyOn(createAccountStub, 'create').mockImplementationOnce(async () => {
      return Promise.reject(new Error());
    });

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new ServerError('')));
  });

  it('should be able to create a new account with valid data', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      created({
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
      }),
    );
  });

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return an error if validation return an error', async () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('anyfield'));

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(badRequest(new MissingParamError('anyfield')));
  });
});
