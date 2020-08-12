import bcrypt from 'bcrypt';
import { BcryptAdapter } from './BcryptAdapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return Promise.resolve('hash_value');
  },
}));

const salt = 12;

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
  it('should call bcrypt with correct value', async () => {
    const sut = makeSut();

    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.encrypt('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('should return hash on success', async () => {
    const sut = makeSut();

    const hash = await sut.encrypt('any_value');

    expect(hash).toBe('hash_value');
  });

  it('should throw if bcrypt throws', async () => {
    const sut = makeSut();

    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(Promise.reject(new Error()));

    await expect(sut.encrypt('any_value')).rejects.toThrow();
  });
});
