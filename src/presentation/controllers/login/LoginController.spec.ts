import { LoginController } from './LoginController';
import { badRequest } from '../../helpers/httpHelper';
import { MissingParamError } from '../../errors';

describe('LoginController', () => {
  it('should return an error with no email was provided', async () => {
    const sut = new LoginController();

    const httpRequest = {
      body: {
        password: 'anypassword',
      },
    };

    const httpReponse = await sut.handle(httpRequest);

    expect(httpReponse).toEqual(badRequest(new MissingParamError('email')));
  });
});
