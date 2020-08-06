import SignUpController from './SignUpController';

describe('SignUp Controller', () => {
  it('should return 400 if name was not provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        email: 'anymail@mail.com',
        password: 'anypassword',
        passwordConfirmation: 'anypassword',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error('Field name is required'));
  });
});
