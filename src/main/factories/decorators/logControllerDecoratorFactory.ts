import { Controller } from '@/presentation/protocols';
import { LogMongoRepository } from '@/infra/db/mongodb/repositories/log/LogMongoRepository';
import { LogControllerDecorator } from '../../decorators/LogControllerDecorator';

export const makeLogControllerDecorator = (
  controller: Controller,
): Controller => {
  const logErrorRepository = new LogMongoRepository();

  return new LogControllerDecorator(controller, logErrorRepository);
};
