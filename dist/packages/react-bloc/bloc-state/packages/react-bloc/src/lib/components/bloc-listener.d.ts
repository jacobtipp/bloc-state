import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { BlocListenerProps } from '../hooks';
/**
 * A component that uses the `useBlocListener` hook to perform side effects in response to state
 * changes in a specified Bloc. It does not render any additional UI elements itself but provides
 * a mechanism to respond to Bloc state changes while rendering its child components.
 *
 * @template Bloc The class type of the Bloc extending BlocBase with any type of state.
 * @param {React.PropsWithChildren<BlocListenerProps<Bloc> & { bloc: Bloc }>} props The properties for the BlocListener component.
 * @returns A JSX.Element that renders the provided children without altering the UI.
 */
export declare function BlocListener<Bloc extends ClassType<BlocBase<any>>>({ bloc, listener, listenWhen, children, }: React.PropsWithChildren<BlocListenerProps<Bloc> & {
    bloc: Bloc;
}>): JSX.Element;
