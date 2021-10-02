export class BlocError extends Error {}

export class InvalidConstructorArgumentsError extends BlocError {
  constructor(message = "Invalid constructor arguments for Bloc State.") {
    super(message);
  }
}
