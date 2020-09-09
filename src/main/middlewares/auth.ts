import { adaptMiddleware } from '../adapters/express/expressMiddlewareAdapter';
import { makeAuthMiddleware } from '../factories/middlewares/authMiddlewareFactory';

export const auth = adaptMiddleware(makeAuthMiddleware());
