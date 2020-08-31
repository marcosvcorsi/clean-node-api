export class EmailInUseError extends Error {
  constructor() {
    super('The received email already in use');
    this.name = 'EmailInUseError';
  }
}
