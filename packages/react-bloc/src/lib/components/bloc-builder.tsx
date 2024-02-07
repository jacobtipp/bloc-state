import { BlocBase, ClassType, StateType } from '@jacobtipp/bloc';
import { defaultBuildWhen, useBlocInstance } from '../hooks';
import { useLayoutEffect, useRef, useState } from 'react';
import { Subscription, filter, map, pairwise, startWith } from 'rxjs';

/**
 * Props for BlocBuilder component, specifying how to build UI based on Bloc's state changes.
 *
 * @template Bloc The class type of the Bloc extending BlocBase with any type of state.
 * @template State The state type that the Bloc manages, defaults to the Bloc's state type.
 */
export interface BlocBuilderProps<
  Bloc extends ClassType<BlocBase<any>>,
  State = StateType<InstanceType<Bloc>>
> {
  /** The Bloc class to observe for state changes. */
  bloc: Bloc;
  /** Function to build the UI based on the current state. */
  builder: (state: State) => JSX.Element;
  /** Optional function to determine if the UI should be rebuilt when the state changes. */
  buildWhen?: (previous: State, current: State) => boolean;
}

/**
 * A component that listens to state changes from a Bloc and rebuilds its UI accordingly.
 *
 * This component uses a provided `bloc` to listen for state changes and uses the `builder`
 * function to rebuild the UI based on the current state. An optional `buildWhen` function
 * can be provided to determine if the UI should rebuild on a state change.
 *
 * @param {BlocBuilderProps<Bloc>} props The properties for configuring the BlocBuilder.
 * @returns A JSX.Element built from the current state of the Bloc.
 * @template Bloc Extends ClassType<BlocBase<any>> to ensure the provided Bloc is based on BlocBase.
 */
export function BlocBuilder<Bloc extends ClassType<BlocBase<any>>>({
  bloc,
  builder,
  buildWhen,
}: BlocBuilderProps<Bloc>): JSX.Element {
  const blocInstance = useBlocInstance(bloc); // Retrieve the instance of the bloc.
  const when = buildWhen ?? defaultBuildWhen; // Determine when to rebuild the UI.
  const listenerSubscription = useRef<Subscription | null>(null); // Subscription to bloc state changes.
  const [state, setState] = useState(() => blocInstance.state); // Initial state from the bloc.

  useLayoutEffect(() => {
    // Subscribe to the bloc state changes with initial state and filtering based on `buildWhen`.
    listenerSubscription.current = blocInstance.state$
      .pipe(
        startWith(state), // Start with the initial state.
        pairwise(), // Emit the previous and current state as an array.
        filter(([previous, current]) => when(previous, current)), // Filter based on `buildWhen`.
        map(([_, current]) => setState(current)) // Set the new state.
      )
      .subscribe();

    // Cleanup the subscription on component unmount.
    return () => {
      listenerSubscription.current?.unsubscribe();
      listenerSubscription.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this effect runs once on mount.

  return builder(state); // Build the UI based on the current state.
}
