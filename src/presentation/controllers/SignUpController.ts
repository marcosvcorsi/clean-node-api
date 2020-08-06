export default class SignUpController {
  handle(request: any): any {
    console.log(request);

    return {
      statusCode: 400,
      body: new Error('Field name is required'),
    };
  }
}
