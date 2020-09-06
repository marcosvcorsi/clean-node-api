import { Request, Response, NextFunction } from 'express';
import { HttpRequest, Middleware } from '../../../presentation/protocols';

export const adaptMiddleware = (middleware: Middleware) => {
  return async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<any> => {
    const httpRequest: HttpRequest = {
      headers: request.headers,
    };

    const httpResponse = await middleware.handle(httpRequest);

    const { statusCode, body } = httpResponse;

    if (statusCode !== 200) {
      return response.status(statusCode).json({ error: body.message });
    }

    Object.assign(request, body);

    return next();
  };
};
