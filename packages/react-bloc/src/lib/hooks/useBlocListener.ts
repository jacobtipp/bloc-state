import { BlocBase, StateType, ClassType, Bloc } from '@jacobtipp/bloc';
import { useRef } from 'react';
import { useBlocInstance } from './useBlocInstance';
import { defaultListenWhen } from './defaults';
import { Subscription, filter, map, pairwise, startWith } from 'rxjs';
import { useIsomorphicLayoutEffect } from '../util';

/**
 * Interface for the properties accepted by the useBlocListener hook. It defines how to listen
 * to state changes in a Bloc and trigger side effects based on those changes.
 *
 * @template Bloc The class type of the Bloc extending BlocBase with any type of state.
 * @template State The state type that the Bloc manages, defaults to the Bloc's state type.
 */
export interface BlocListenerProps<
  Bloc extends ClassType<BlocBase<any>>,
  State = StateType<InstanceType<Bloc>>
> {
  /** Function to be called when the specified conditions are met. */
  listener: (bloc: InstanceType<Bloc>, state: State) => void;
  /** Optional function to determine whether the listener should be called based on state changes. */
  listenWhen?: (previous: State, current: State) => boolean;
}

/**
 * A custom hook that listens to state changes in a Bloc and triggers a callback function based
 * on those changes. It provides a mechanism to perform side effects in response to Bloc state updates.
 *
 * @param {Bloc} bloc The Bloc class to listen to.
 * @param {BlocListenerProps<Bloc>} options An object containing the listener callback function
 * and an optional condition function to decide when the listener should be triggered.
 * @template Bloc Extends ClassType<BlocBase<any>> to ensure the provided Bloc is based on BlocBase.
 */
export const useBlocListener = <Bloc extends ClassType<BlocBase<any>>>(
  bloc: Bloc,
  { listener, listenWhen }: BlocListenerProps<Bloc>
) => {
  const blocInstance = useBlocInstance(bloc); // Retrieve the instance of the Bloc.
  const when = listenWhen ?? defaultListenWhen; // Use the provided condition or the default.
  const listenerSubscription = useRef<Subscription | null>(null); // Holds the subscription to Bloc state changes.

  useIsomorphicLayoutEffect(() => {
    // Subscribe to state changes with conditions to decide when to call the listener.
    listenerSubscription.current = blocInstance.state$
      .pipe(
        startWith(blocInstance.state), // Emit the initial state.
        pairwise(), // Emit previous and current state as a pair.
        filter(
          ([previous, current]) =>
            !Bloc.ignoreListeners && when(previous, current)
        ), // Check condition.
        map(([_, current]) => listener(blocInstance, current)) // Call listener with current state.
      )
      .subscribe();

    // Cleanup the subscription on hook unmount or dependencies change.
    return () => {
      listenerSubscription.current?.unsubscribe();
      listenerSubscription.current = null;
    };
  }, [blocInstance]); // Dependency array includes blocInstance to re-subscribe on instance change.
};
