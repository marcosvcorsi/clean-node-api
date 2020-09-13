import { Decrypter } from '../protocols/cryptography/Decrypter';
import { Encrypter } from '../protocols/cryptography/Encrypter';
import { HashComparer } from '../protocols/cryptography/HashComparer';
import { Hasher } from '../protocols/cryptography/Hasher';

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return Promise.resolve(value);
    }
  }

  return new HasherStub();
};

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt() {
      return 'anyvalue';
    }
  }

  return new DecrypterStub();
};

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return Promise.resolve(`${value}_token`);
    }
  }

  return new EncrypterStub();
};

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(!!value && !!hash);
    }
  }

  return new HashComparerStub();
};
