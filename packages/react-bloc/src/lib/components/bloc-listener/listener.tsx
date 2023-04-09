import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { useLayoutSubscription, useObservable } from 'observable-hooks';
import { filter, map, pairwise, startWith } from 'rxjs';
import { useBlocInstance } from '../../hooks';
import { StateType } from '../../types';
import { useMemo } from 'react';

/**
 * Props for the BlocListener component.
 * @typeparam B The type of the bloc that this listener will be attached to.
 */
export interface BlocListenerProps<B extends BlocBase<any>> {
  /**
   * The bloc class to attach the listener to.
   */
  bloc: ClassType<B>;
  /**
   * Function to be called when a new state is emitted.
   * @param bloc The bloc instance.
   * @param state The new state.
   */
  listener: (bloc: B, state: StateType<InstanceType<this['bloc']>>) => void;
  /**
   * Optional function to determine whether or not to call the `listener` function based on the previous and current states.
   * @param previous The previous state.
   * @param current The current state.
   * @returns A boolean indicating whether or not to call the `listener` function.
   */
  listenWhen?: (
    previous: StateType<InstanceType<this['bloc']>>,
    current: StateType<InstanceType<this['bloc']>>
  ) => boolean;
}

/**
 * A React component that listens to changes in the state of the provided bloc and calls the `listener` function when the state changes.
 * @typeparam B The type of the bloc that this component will be attached to.
 * @param props The props object containing the bloc to listen to, the listener function, and an optional `listenWhen` function.
 * @returns The JSX element containing the child components.
 */
export function BlocListener<B extends BlocBase<any>>({
  bloc,
  listener,
  listenWhen,
  children,
}: React.PropsWithChildren<BlocListenerProps<B>>): JSX.Element {
  /**
   * The bloc instance returned by the `useBlocInstance` hook.
   */
  const blocInstance = useBlocInstance(bloc);

  /**
   * The listener function returned by the `useMemo` hook.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const blocListener = useMemo(() => listener, []);

  /**
   * The `listenWhen` function returned by the `useMemo` hook.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const when = useMemo(() => listenWhen ?? (() => true), []);

  /**
   * An Observable that emits the current and previous state of the bloc instance, filtered based on the `listenWhen` function.
   */
  const state$ = useObservable(() =>
    blocInstance.state$.pipe(
      startWith(blocInstance.state),
      pairwise(),
      filter(([previous, current]) => {
        return when(previous, current);
      }),
      map(([_, current]) => current)
    )
  );

  /**
   * Calls the `blocListener` function with the updated state.
   */
  useLayoutSubscription(state$, (next) => {
    blocListener(blocInstance, next);
  });

  return <> {children} </>;
}
