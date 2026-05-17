export class IntervalError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, IntervalError.prototype);
    this.name = 'IntervalError';
  }
}
