import { LoginController } from '@/presentation/controllers/account/login/LoginController';
import { Controller } from '@/presentation/protocols';
import { makeLoginValidation } from './loginValidationFactory';
import { makeDbAuthentication } from '../../../useCases/account/authentication/dbAuthenticationFactory';
import { makeLogControllerDecorator } from '../../../decorators/logControllerDecoratorFactory';

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation(),
  );

  return makeLogControllerDecorator(loginController);
};
