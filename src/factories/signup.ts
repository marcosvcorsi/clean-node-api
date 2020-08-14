import SignUpController from '../presentation/controllers/SignUp/SignUpController';
import EmailValidatorAdapter from '../utils/EmailValidatorAdapter';
import DbCreateAccount from '../data/useCases/createAccount/DbCreateAccount';
import { BcryptAdapter } from '../infra/cryptography/BcryptAdapter';
import { AccountMongoRepository } from '../infra/db/mongodb/repositories/account/AccountRepository';

export const makeSignUpController = (): SignUpController => {
  const emailValidator = new EmailValidatorAdapter();

  const salt = 12;
  const bcrypAdapter = new BcryptAdapter(salt);

  const accountMongoRepository = new AccountMongoRepository();

  const createAccount = new DbCreateAccount(
    bcrypAdapter,
    accountMongoRepository,
  );

  return new SignUpController(emailValidator, createAccount);
};
