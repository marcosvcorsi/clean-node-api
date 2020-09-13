import { Request, Response } from 'express';
import { Controller, HttpRequest } from '@/presentation/protocols';

export const adaptRoute = (controller: Controller) => {
  return async (request: Request, response: Response): Promise<Response> => {
    const httpRequest: HttpRequest = {
      body: request.body,
      params: request.params,
      accountId: request.accountId,
    };

    const httpResponse = await controller.handle(httpRequest);

    const { statusCode, body } = httpResponse;

    if (statusCode >= 400) {
      return response.status(statusCode).json({ error: body.message });
    }

    return response.status(statusCode).json(body);
  };
};
