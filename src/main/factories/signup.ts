import SignUpController from '../../presentation/controllers/signup/SignUpController';
import EmailValidatorAdapter from '../../utils/EmailValidatorAdapter';
import DbCreateAccount from '../../data/useCases/createAccount/DbCreateAccount';
import { BcryptAdapter } from '../../infra/cryptography/BcryptAdapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/repositories/account/AccountRepository';
import { LogControllerDecorator } from '../decorators/LogController';
import { Controller } from '../../presentation/protocols';
import { LogMongoRepository } from '../../infra/db/mongodb/repositories/log/LogRepository';

export const makeSignUpController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter();

  const salt = 12;
  const bcrypAdapter = new BcryptAdapter(salt);

  const accountMongoRepository = new AccountMongoRepository();

  const createAccount = new DbCreateAccount(
    bcrypAdapter,
    accountMongoRepository,
  );

  const signUpController = new SignUpController(emailValidator, createAccount);

  const logErrorRepository = new LogMongoRepository();

  return new LogControllerDecorator(signUpController, logErrorRepository);
};
