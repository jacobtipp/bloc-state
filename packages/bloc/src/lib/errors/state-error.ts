/**
 * Represents an error that occurs when there is an issue with the state of the application.
 */
export class StateError extends Error {
  /**
   * Creates an instance of StateError.
   *
   * @param message The error message.
   */
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, StateError.prototype);
  }
}
