import { useEffect, useRef } from 'react';
import { defaultListenWhen } from './defaults';
import { Subject, Subscription, filter, map, pairwise, startWith } from 'rxjs';
import { Bloc } from '@jacobtipp/bloc';
import { useIsomorphicLayoutEffect } from '../util';

/**
 * Defines the listener configuration for a prop. It includes a listener function
 * that gets called when the prop changes, and an optional listenWhen function
 * to determine if the listener should be called based on the old and new prop values.
 *
 * @template Prop The type of the prop being listened to.
 */
export interface PropListener<Prop> {
  listener: (prop: Prop) => void;
  listenWhen?: (previous: Prop, current: Prop) => boolean;
}

/**
 * A custom React hook that listens to changes in a prop and executes a callback function
 * when the prop changes, according to optional custom logic defined in a listenWhen function.
 *
 * This hook utilizes RxJS to create a stream of prop changes, allowing for complex filtering,
 * mapping, and pairwise comparison of prop values to determine when the listener callback should
 * be executed.
 *
 * @template Prop The type of the prop being listened to.
 *
 * @param {Prop} prop The prop value to listen to for changes.
 * @param {PropListener<Prop>} param1 An object containing the listener callback and an optional
 * listenWhen function that determines when the listener is called based on changes in the prop.
 * @param {any[]} [deps] Optional dependency array to control the effect's re-execution similar to
 * useEffect's dependency array. This can include values that, when changed, should re-setup the listener.
 */
export const usePropListener = <Prop>(
  prop: Prop,
  { listener, listenWhen }: PropListener<Prop>,
  deps?: any[]
) => {
  // Fallback to a default listenWhen function if none is provided.
  const when = listenWhen ?? defaultListenWhen;
  const listenerSubscription = useRef<Subscription | null>(null);
  const listenerSubject = useRef<Subject<Prop> | null>(null);

  // Update the subject with the new prop value whenever it changes.
  useEffect(() => {
    listenerSubject.current?.next(prop);
  }, [prop]);

  // Setup and teardown of the RxJS subscription to listen to prop changes.
  useIsomorphicLayoutEffect(() => {
    // Initialize the subject for prop changes.
    listenerSubject.current = new Subject<Prop>();
    // Subscribe to the subject to listen to prop changes.
    listenerSubscription.current = listenerSubject.current
      .pipe(
        // Start with the initial prop value.
        startWith(prop),
        // Emit the previous and current value as a pair.
        pairwise(),
        // Filter the emissions based on the listenWhen condition.
        filter(([previous, current]) => {
          return !Bloc.ignoreListeners && when(previous, current);
        }),
        // Execute the listener function with the current prop value.
        map(([_, current]) => listener(current))
      )
      .subscribe();

    // Cleanup function to unsubscribe and complete the subject.
    return () => {
      listenerSubscription.current?.unsubscribe();
      listenerSubscription.current = null;
      listenerSubject.current?.complete();
      listenerSubject.current = null;
    };
    // Re-run this effect when any dependency changes, if provided.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps ?? []);
};
