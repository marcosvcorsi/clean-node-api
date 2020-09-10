import { CreateAccount } from '@/domain/useCases/CreateAccount';
import { BcryptAdapter } from '@/infra/cryptography/bcryptAdapter/BcryptAdapter';
import { AccountMongoRepository } from '@/infra/db/mongodb/repositories/account/AccountMongoRepository';
import DbCreateAccount from '@/data/useCases/createAccount/DbCreateAccount';

export const makeDbCreateAccount = (): CreateAccount => {
  const salt = 12;
  const bcrypAdapter = new BcryptAdapter(salt);

  const accountMongoRepository = new AccountMongoRepository();

  return new DbCreateAccount(
    bcrypAdapter,
    accountMongoRepository,
    accountMongoRepository,
  );
};
