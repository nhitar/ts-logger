export class TaskNameError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, TaskNameError.prototype);
    this.name = 'TaskNameError';
  }
}
