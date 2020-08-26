import SignUpController from '../../../presentation/controllers/signup/SignUpController';
import DbCreateAccount from '../../../data/useCases/createAccount/DbCreateAccount';
import { BcryptAdapter } from '../../../infra/cryptography/bcryptAdapter/BcryptAdapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/repositories/account/AccountMongoRepository';
import { LogControllerDecorator } from '../../decorators/LogControllerDecorator';
import { Controller } from '../../../presentation/protocols';
import { LogMongoRepository } from '../../../infra/db/mongodb/repositories/log/LogMongoRepository';
import { makeSignUpValidation } from './signupValidationFactory';

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const bcrypAdapter = new BcryptAdapter(salt);

  const accountMongoRepository = new AccountMongoRepository();

  const createAccount = new DbCreateAccount(
    bcrypAdapter,
    accountMongoRepository,
  );

  const signUpController = new SignUpController(
    createAccount,
    makeSignUpValidation(),
  );

  const logErrorRepository = new LogMongoRepository();

  return new LogControllerDecorator(signUpController, logErrorRepository);
};
