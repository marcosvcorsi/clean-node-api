import { LogControllerDecorator } from './LogController';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';

interface SutType {
  sut: LogControllerDecorator;
  controllerStub: Controller;
}

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

  const sut = new LogControllerDecorator(controllerStub);

  return {
    sut,
    controllerStub,
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
});
