/**
 * A base abstract class representing an event in a bloc.
 */
export abstract class BlocEvent {
  /**
   * The name of the event.
   * Initialized as the name of the constructor function.
   */
  blockEventName: string = this.constructor.name;
}
