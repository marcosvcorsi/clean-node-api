import SignUpController from './SignUpController';

import {
  EmailValidator,
  CreateAccount,
  CreateAccountModel,
  AccountModel,
} from './SignUpProtocols';

import {
  ServerError,
  InvalidParamError,
  MissingParamError,
} from '../../errors';
import { HttpRequest } from '../../protocols';

interface SutType {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  createAccountStub: CreateAccount;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return !!email;
    }
  }

  return new EmailValidatorStub();
};

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

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator();
  const createAccountStub = makeCreateAccount();

  const sut = new SignUpController(emailValidatorStub, createAccountStub);

  return {
    sut,
    emailValidatorStub,
    createAccountStub,
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
  it('should return an error if name was not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'anymail@mail.com',
        password: 'anypassword',
        passwordConfirmation: 'anypassword',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  it('should return an error if email was not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'anyname',
        password: 'anypassword',
        passwordConfirmation: 'anypassword',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('should return an error if password was not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'anyname',
        email: 'anymail@mail.com',
        passwordConfirmation: 'anypassword',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('should return an error if password confirmation was not provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'anyname',
        email: 'anymail@mail.com',
        password: 'anypassword',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation'),
    );
  });

  it('should return an error if email was invalid', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('should validate the email using EmailValidator', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    await sut.handle(makeFakeRequest());

    expect(isValidSpy).toHaveBeenCalledWith('anyemail@mail.com');
  });

  it('should return an server error if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError(''));
  });

  it('should return an error with invalid password confirmation', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'anyname',
        email: 'anyemail@mail.com',
        password: 'anypassword',
        passwordConfirmation: 'otherpassword',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation'),
    );
  });

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

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError(''));
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

    expect(httpResponse.statusCode).toBe(201);
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    });
  });
});
