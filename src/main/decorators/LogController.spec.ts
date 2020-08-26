/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { LogControllerDecorator } from './LogController';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';
import { serverError } from '../../presentation/helpers/http/httpHelper';
import { LogErrorRepository } from '../../data/protocols/db/log/LogErrorRepository';

interface SutType {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return Promise.resolve();
    }
  }

  return new LogErrorRepositoryStub();
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = {
        body: httpRequest.body,
        statusCode: 200,
      };

      return Promise.resolve(httpResponse);
    }
  }

  return new ControllerStub();
};

const makeSut = (): SutType => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();

  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub,
  );

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};

describe('Log Controller Decorate', () => {
  it('should call Controller handle', async () => {
    const { sut, controllerStub } = makeSut();

    const spyHandleController = jest.spyOn(controllerStub, 'handle');

    const httpRequest = {
      body: {},
    };

    await sut.handle(httpRequest);

    expect(spyHandleController).toHaveBeenCalledWith(httpRequest);
  });

  it('should return the same result of controller', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {},
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {},
    });
  });

  it('should call LogErrorRepository with an error when controller throw ServerError', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

    const fakeError = new Error();
    fakeError.stack = 'anystack';

    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(Promise.resolve(serverError(fakeError)));

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');

    const httpRequest = {
      body: {},
    };

    await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenCalledWith('anystack');
  });
});
