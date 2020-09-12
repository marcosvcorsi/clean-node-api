import { LoadAccountByToken } from '@/domain/useCases/account/LoadAccountByToken';
import { DbLoadAccountByToken } from '@/data/useCases/account/loadAccountByToken/DbLoadAccountByToken';
import { AccountMongoRepository } from '@/infra/db/mongodb/repositories/account/AccountMongoRepository';
import { JwtAdapter } from '@/infra/cryptography/jwtAdapter/JwtAdapter';

import authConfig from '@/main/config/auth';

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(authConfig.secret);
  const accountMongoRepository = new AccountMongoRepository();

  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
};
