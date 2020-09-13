import { AccountModel } from '../models/Account';
import { AuthenticationParams } from '../useCases/account/Authentication';
import { CreateAccountParams } from '../useCases/account/CreateAccount';

export const mockCreateAccountParams = (): CreateAccountParams => ({
  name: 'anyname',
  email: 'anymail@mail.com',
  password: 'anypassword',
});

export const mockAccountModel = (): AccountModel => ({
  id: 'anyid',
  ...mockCreateAccountParams(),
});

export const mockAuthentication = (): AuthenticationParams => ({
  email: 'anyemail@mail.com',
  password: 'anypassword',
});
