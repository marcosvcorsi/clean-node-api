import { HttpRequest, HttpResponse } from './http';

export default interface Controller {
  handle(httpRequest: HttpRequest): HttpResponse;
}
