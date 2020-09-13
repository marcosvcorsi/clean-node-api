import { mockAccountModel } from '@/domain/test';
import { CreateAccountRepository } from '../protocols/db/account/CreateAccountRepository';
import { UpdateAccessTokenRepository } from '../protocols/db/account/UpdateAccessTokenRepository';
import {
  AccountModel,
  LoadAccountByEmailRepository,
} from '../useCases/account/createAccount/DbCreateAccountProtocols';
import { LoadAccountByTokenRepository } from '../useCases/account/loadAccountByToken/DbLoadAccountByTokenProtocols';

export const mockCreateAccountRepository = (): CreateAccountRepository => {
  class CreateAccountRepositoryStub implements CreateAccountRepository {
    async create(): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel());
    }
  }

  return new CreateAccountRepositoryStub();
};

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async loadByEmail(): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel());
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

export const mockLoadAccountByTokenRepository = () => {
  class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository {
    async loadByToken(): Promise<AccountModel> {
      return mockAccountModel();
    }
  }

  return new LoadAccountByTokenRepositoryStub();
};

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(id: string, token: string): Promise<void> {
      if (id && token) {
        return Promise.resolve();
      }

      return Promise.reject();
    }
  }

  return new UpdateAccessTokenRepositoryStub();
};
