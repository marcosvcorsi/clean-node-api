import {
  ServerError,
  MissingParamError,
  EmailInUseError,
} from '@/presentation/errors';
import { HttpRequest } from '@/presentation/protocols';
import {
  created,
  badRequest,
  serverError,
  forbidden,
} from '@/presentation/helpers/http/httpHelper';
import {
  mockAuthentication,
  mockValidation,
  mockCreateAccount,
} from '@/presentation/test';
import SignUpController from './SignUpController';
import {
  CreateAccount,
  Validation,
  Authentication,
} from './SignUpControllerProtocols';

type SutType = {
  sut: SignUpController;
  createAccountStub: CreateAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
};

const makeSut = (): SutType => {
  const createAccountStub = mockCreateAccount();
  const validationStub = mockValidation();
  const authenticationStub = mockAuthentication();

  const sut = new SignUpController(
    createAccountStub,
    validationStub,
    authenticationStub,
  );

  return {
    sut,
    createAccountStub,
    validationStub,
    authenticationStub,
  };
};

const mockRequest = (): HttpRequest => {
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

    await sut.handle(mockRequest());

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

    const httpResponse = await sut.handle(mockRequest());

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
      created({ accessToken: 'anytoken', name: 'anyname' }),
    );
  });

  it('should throw an error if createAccount returns null', async () => {
    const { sut, createAccountStub } = makeSut();

    jest
      .spyOn(createAccountStub, 'create')
      .mockReturnValueOnce(Promise.resolve(null));

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = mockRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return an error if validation return an error', async () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('anyfield'));

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(badRequest(new MissingParamError('anyfield')));
  });

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();

    const authSpy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle(mockRequest());

    expect(authSpy).toHaveBeenCalledWith({
      email: 'anyemail@mail.com',
      password: 'anypassword',
    });
  });

  it('should return an error if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpReponse = await sut.handle(mockRequest());

    expect(httpReponse).toEqual(serverError(new Error()));
  });
});
