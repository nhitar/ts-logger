export class ExternalApiFieldsError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ExternalApiFieldsError.prototype);
    this.name = 'Invalid external api fields error.';
  }
}
