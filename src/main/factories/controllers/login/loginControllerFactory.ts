import { LoginController } from '../../../../presentation/controllers/login/LoginController';
import { Controller } from '../../../../presentation/protocols';
import { makeLoginValidation } from './loginValidationFactory';
import { makeDbAuthentication } from '../../useCases/authentication/dbAuthenticationFactory';
import { makeLogControllerDecorator } from '../../decorators/logControllerDecoratorFactory';

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation(),
  );

  return makeLogControllerDecorator(loginController);
};
