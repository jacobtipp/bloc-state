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
export declare const usePropListener: <Prop>(prop: Prop, { listener, listenWhen }: PropListener<Prop>, deps?: any[]) => void;
