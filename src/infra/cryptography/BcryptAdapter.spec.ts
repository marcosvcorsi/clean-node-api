import bcrypt from 'bcrypt';
import { BcryptAdapter } from './BcryptAdapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return Promise.resolve('hash_value');
  },
}));

describe('Bcrypt Adapter', () => {
  it('should call bcrypt with correct value', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);

    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.encrypt('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('should return hash on success', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);

    const hash = await sut.encrypt('any_value');

    expect(hash).toBe('hash_value');
  });
});
