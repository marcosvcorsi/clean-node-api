import { Express, Router } from 'express';
import { readdirSync } from 'fs';
import path from 'path';

export default (app: Express): void => {
  const router = Router();

  app.use('/api', router);

  const routesPath = path.resolve(__dirname, '..', 'routes');

  readdirSync(routesPath)
    .filter(file => !file.includes('.test.'))
    .map(async file => {
      (await import(path.resolve(routesPath, file))).default(router);
    });
};
