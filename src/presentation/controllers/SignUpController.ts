export default class SignUpController {
  handle(request: any): any {
    if (!request.body.name) {
      return {
        statusCode: 400,
        body: new Error('Field name is required'),
      };
    }

    if (!request.body.email) {
      return {
        statusCode: 400,
        body: new Error('Field e-mail is required'),
      };
    }

    return {};
  }
}
