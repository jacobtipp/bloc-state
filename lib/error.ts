export class BlocError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class InvalidConstructorArgumentsError extends BlocError {
  constructor(message = "Invalid constructor arguments for Bloc State.") {
    super(message);
  }
}
