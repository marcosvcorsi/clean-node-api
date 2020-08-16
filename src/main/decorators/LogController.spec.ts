import { LogControllerDecorator } from './LogController';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';

describe('Log Controller Decorate', () => {
  it('should call Controller handle', async () => {
    class ControllerStub implements Controller {
      async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse = {
          body: httpRequest.body,
          statusCode: 200,
        };

        return Promise.resolve(httpResponse);
      }
    }

    const controlleStub = new ControllerStub();

    const spyHandleController = jest.spyOn(controlleStub, 'handle');

    const sut = new LogControllerDecorator(controlleStub);

    const httpRequest = {
      body: {},
    };

    await sut.handle(httpRequest);

    expect(spyHandleController).toHaveBeenCalledWith(httpRequest);
  });
});
