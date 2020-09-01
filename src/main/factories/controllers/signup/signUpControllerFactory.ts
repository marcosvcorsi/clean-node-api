import SignUpController from '../../../../presentation/controllers/signup/SignUpController';
import { Controller } from '../../../../presentation/protocols';
import { makeSignUpValidation } from './signUpValidationFactory';
import { makeDbAuthentication } from '../../useCases/authentication/dbAuthenticationFactory';
import { makeDbCreateAccount } from '../../useCases/createAccount/dbCreateAccountFactory';
import { makeLogControllerDecorator } from '../../decorators/logControllerDecoratorFactory';

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(
    makeDbCreateAccount(),
    makeSignUpValidation(),
    makeDbAuthentication(),
  );

  return makeLogControllerDecorator(signUpController);
};
