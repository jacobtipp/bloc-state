export class TestApiError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, TestApiError.prototype);
  }
}
