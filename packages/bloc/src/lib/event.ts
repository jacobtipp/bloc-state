/**
 * Abstract class that represents an event in a BLoC.
 */
export abstract class BlocEvent {
  /**
   * The name of the event, which is the same as the name of the
   * constructor function.
   */
  name = this.constructor.name;
}
