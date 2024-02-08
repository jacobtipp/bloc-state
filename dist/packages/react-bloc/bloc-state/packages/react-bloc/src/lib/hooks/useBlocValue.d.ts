import { BlocBase, StateType, ClassType } from '@jacobtipp/bloc';
/**
 * A custom React hook that subscribes to the state of a specified Bloc and returns its current value.
 * This hook uses `useSyncExternalStore` to subscribe to Bloc state changes in a way that is compatible
 * with React's concurrent features, ensuring that the component using this hook re-renders with the latest state.
 *
 * @template Bloc The class type of the Bloc extending BlocBase with any type of state.
 * @template Value The specific type of state managed by the Bloc. This allows the hook to be typed
 * according to the state type of the Bloc being used, improving type safety and developer experience.
 * @param {Bloc} bloc The class of the Bloc for which the current state value is desired.
 * @returns {Value} The current state value of the specified Bloc. This value is updated whenever the Bloc's state changes.
 */
export declare const useBlocValue: <Bloc extends ClassType<BlocBase<any>>, Value = StateType<InstanceType<Bloc>>>(bloc: Bloc) => Value;
