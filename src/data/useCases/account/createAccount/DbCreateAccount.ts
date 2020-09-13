import {
  Hasher,
  CreateAccount,
  CreateAccountParams,
  AccountModel,
  CreateAccountRepository,
  LoadAccountByEmailRepository,
} from './DbCreateAccountProtocols';

export default class DbCreateAccount implements CreateAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly createAccountRepository: CreateAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  async create(accountData: CreateAccountParams): Promise<AccountModel> {
    const findAccount = await this.loadAccountByEmailRepository.loadByEmail(
      accountData.email,
    );

    if (!findAccount) {
      const hashedPassword = await this.hasher.hash(accountData.password);

      const account = await this.createAccountRepository.create({
        ...accountData,
        password: hashedPassword,
      });

      return account;
    }

    return null;
  }
}
