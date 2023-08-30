import { Observable } from 'rxjs';
import { Emitter } from './emitter';

/**
 * A type definition for classes that can be instantiated.
 * `ClassType` is a generic interface.
 * @typeparam T - The type of the class that will be newable.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export interface ClassType<T> extends Function {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
}

/**
 * A type definition for abstract classes that can be instantiated.
 * `AbstractClassType` is a generic type.
 * @typeparam T - The type of the class that will be abstract and newable.
 */
export type AbstractClassType<T> = abstract new (...args: any[]) => T;

/**
 * EventHandler that takes an event and emits state changes.
 *
 * @template E - The generic type of the event.
 * @template S - The generic type of the state.
 */
export type EventHandler<E, S> = (
  event: InstanceType<ClassType<E>>,
  emitter: Emitter<S>
) => void | Promise<void>;

/**
 * A function that takes an observable sequence of events and a mapper and returns the transformed observable sequence of events.
 *
 * @template Event - The generic type of the event sequence being transformed.
 */
export type EventTransformer<Event> = (
  events$: Observable<Event>,
  mapper: EventMapper<Event>
) => Observable<Event>;

/**
 * A function that maps an event to an observable sequence of events.
 *
 * @template Event - The generic type of the event sequence being transformed.
 */
export type EventMapper<Event> = (event: Event) => Observable<Event>;
