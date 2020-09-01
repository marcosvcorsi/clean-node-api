import { Authentication } from '../../../../domain/useCases/Authentication';
import { AccountMongoRepository } from '../../../../infra/db/mongodb/repositories/account/AccountMongoRepository';
import { BcryptAdapter } from '../../../../infra/cryptography/bcryptAdapter/BcryptAdapter';
import { JwtAdapter } from '../../../../infra/cryptography/jwtAdapter/JwtAdapter';
import { DbAuthentication } from '../../../../data/useCases/authentication/DbAuthentication';

export const makeDbAuthentication = (): Authentication => {
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

  return dbAuthentication;
};
