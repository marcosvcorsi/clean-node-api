import { AuthenticationModel } from '@/domain/models/Authentication';
import { mockAccountModel } from '@/domain/test';
import { Authentication } from '../controllers/account/login/LoginControllerProtocols';

import {
  AccountModel,
  CreateAccount,
} from '../controllers/account/signup/SignUpControllerProtocols';
import { LoadAccountByToken } from '../middlewares/AuthMiddlewareProtocols';

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(): Promise<AuthenticationModel> {
      return Promise.resolve({ accessToken: 'anytoken', name: 'anyname' });
    }
  }

  return new AuthenticationStub();
};

export const mockCreateAccount = (): CreateAccount => {
  class CreateAccountStub implements CreateAccount {
    async create(): Promise<AccountModel> {
      return mockAccountModel();
    }
  }

  return new CreateAccountStub();
};

export const mockLoadAccountByToken = () => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(): Promise<AccountModel> {
      return mockAccountModel();
    }
  }

  return new LoadAccountByTokenStub();
};
