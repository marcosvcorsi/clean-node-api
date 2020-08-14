import request from 'supertest';
import app from '../config/app';

describe('SignUp Routes', () => {
  it('should return an account on sucess', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'anyname',
        email: 'anymail@mail.com.br',
        password: 'anypassword',
        passwordConfirmation: 'anypassword',
      })
      .expect(200);
  });
});
