import jwt from 'jsonwebtoken';
import { JwtAdapter } from './JwtAdapter';

describe('Jwt Adapter', () => {
  it('should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret');

    const jwtSpy = jest.spyOn(jwt, 'sign');

    await sut.encrypt('any_id');

    expect(jwtSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
  });
});
