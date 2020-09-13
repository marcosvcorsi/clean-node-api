import {
  badRequest,
  serverError,
  unauthorized,
  ok,
} from '@/presentation/helpers/http/httpHelper';
import { mockAuthentication, mockValidation } from '@/presentation/test';
import { LoginController } from './LoginController';
import { MissingParamError } from '../../../errors';
import {
  HttpRequest,
  Authentication,
  Validation,
} from './LoginControllerProtocols';

type SutType = {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
};

const makeSut = (): SutType => {
  const authenticationStub = mockAuthentication();
  const validationStub = mockValidation();

  const sut = new LoginController(authenticationStub, validationStub);

  return {
    sut,
    authenticationStub,
    validationStub,
  };
};

const mockRequest = (): HttpRequest => ({
  body: {
    email: 'anymail@mail.com',
    password: 'anypassword',
  },
});

describe('LoginController', () => {
  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();

    const authSpy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle(mockRequest());

    expect(authSpy).toHaveBeenCalledWith({
      email: 'anymail@mail.com',
      password: 'anypassword',
    });
  });

  it('should return an error if invalid credentials were provided', async () => {
    const { sut, authenticationStub } = makeSut();

    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(Promise.resolve(null));

    const httpReponse = await sut.handle(mockRequest());

    expect(httpReponse).toEqual(unauthorized());
  });

  it('should return an error if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpReponse = await sut.handle(mockRequest());

    expect(httpReponse).toEqual(serverError(new Error()));
  });

  it('should be able to authenticate with valid credentials', async () => {
    const { sut } = makeSut();
    const httpReponse = await sut.handle(mockRequest());

    expect(httpReponse).toEqual(ok({ accessToken: 'anytoken' }));
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
});
