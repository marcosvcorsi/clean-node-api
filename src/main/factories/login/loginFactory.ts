import { LoginController } from '../../../presentation/controllers/login/LoginController';
import { Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/LogControllerDecorator';
import { LogMongoRepository } from '../../../infra/db/mongodb/repositories/log/LogMongoRepository';
import { DbAuthentication } from '../../../data/useCases/authentication/DbAuthentication';
import { makeLoginValidation } from './loginValidationFactory';
import { AccountMongoRepository } from '../../../infra/db/mongodb/repositories/account/AccountMongoRepository';
import { BcryptAdapter } from '../../../infra/cryptography/bcryptAdapter/BcryptAdapter';
import { JwtAdapter } from '../../../infra/cryptography/jwtAdapter/JwtAdapter';

export const makeLoginController = (): Controller => {
  const salt = 12;

  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdaper = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(process.env.JWT_SECRET);

  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdaper,
    jwtAdapter,
    accountMongoRepository,
  );

  const loginController = new LoginController(
    dbAuthentication,
    makeLoginValidation(),
  );

  const logErrorRepository = new LogMongoRepository();

  return new LogControllerDecorator(loginController, logErrorRepository);
};
