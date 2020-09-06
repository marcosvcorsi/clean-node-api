import { LoadAccountByToken } from '../../../../../domain/useCases/LoadAccountByToken';
import { DbLoadAccountByToken } from '../../../../../data/useCases/loadAccountByToken/DbLoadAccountByToken';
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/repositories/account/AccountMongoRepository';
import { JwtAdapter } from '../../../../../infra/cryptography/jwtAdapter/JwtAdapter';

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(process.env.JWT_SECRET);
  const accountMongoRepository = new AccountMongoRepository();

  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
};
