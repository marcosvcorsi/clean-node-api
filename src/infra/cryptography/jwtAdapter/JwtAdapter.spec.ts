import jwt from 'jsonwebtoken';
import { JwtAdapter } from './JwtAdapter';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return Promise.resolve('any_token');
  },

  async verify(): Promise<string> {
    return Promise.resolve('anyvalue');
  },
}));

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret');
};

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    it('should call sign with correct values', async () => {
      const sut = makeSut();

      const jwtSpy = jest.spyOn(jwt, 'sign');

      await sut.encrypt('any_id');

      expect(jwtSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
    });

    it('should return a token from sign with correct values', async () => {
      const sut = makeSut();

      const token = await sut.encrypt('any_id');

      expect(token).toBe('any_token');
    });

    it('should throw if sign throws', async () => {
      const sut = makeSut();

      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(sut.encrypt('any_id')).rejects.toThrow();
    });
  });

  describe('verify()', () => {
    it('should call verify with correct values', async () => {
      const sut = makeSut();

      const verifySpy = jest.spyOn(jwt, 'verify');

      await sut.decrypt('anytoken');

      expect(verifySpy).toHaveBeenCalledWith('anytoken', 'secret');
    });

    it('should return a value from verify on success', async () => {
      const sut = makeSut();

      const value = await sut.decrypt('anytoken');

      expect(value).toBe('anyvalue');
    });

    it('should throw if verify throws', async () => {
      const sut = makeSut();

      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(sut.decrypt('anytoken')).rejects.toThrow();
    });
  });
});
