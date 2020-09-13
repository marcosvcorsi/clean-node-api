import { throwError } from '@/domain/test';
import bcrypt from 'bcrypt';
import { BcryptAdapter } from './BcryptAdapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return Promise.resolve('hash_value');
  },

  async compare(value: string, hash: string): Promise<boolean> {
    return Promise.resolve(!!value && !!hash);
  },
}));

const salt = 12;

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    it('should call hash with correct value', async () => {
      const sut = makeSut();

      const hashSpy = jest.spyOn(bcrypt, 'hash');

      await sut.hash('any_value');

      expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    });

    it('should return valid hash on success', async () => {
      const sut = makeSut();

      const hash = await sut.hash('any_value');

      expect(hash).toBe('hash_value');
    });

    it('should throw if hash throws', async () => {
      const sut = makeSut();

      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(throwError);

      await expect(sut.hash('any_value')).rejects.toThrow();
    });
  });

  describe('compare()', () => {
    it('should call compare with correct value', async () => {
      const sut = makeSut();

      const hashSpy = jest.spyOn(bcrypt, 'compare');

      await sut.compare('any_value', 'any_hash');

      expect(hashSpy).toHaveBeenCalledWith('any_value', 'any_hash');
    });

    it('should return true when compare succeeds', async () => {
      const sut = makeSut();

      const match = await sut.compare('any_value', 'any_hash');

      expect(match).toBe(true);
    });

    it('should return false when values doest not match', async () => {
      const sut = makeSut();

      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(Promise.resolve(false));

      const match = await sut.compare('any_value', 'any_hash');

      expect(match).toBe(false);
    });

    it('should throw if compare throws', async () => {
      const sut = makeSut();

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(throwError);

      await expect(sut.compare('any_value', 'any_hash')).rejects.toThrow();
    });
  });
});
