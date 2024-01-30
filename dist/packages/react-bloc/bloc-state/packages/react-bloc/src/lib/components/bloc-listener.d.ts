import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { BlocListenerProps } from '../hooks';
export declare function BlocListener<Bloc extends ClassType<BlocBase<any>>>({ bloc, listener, listenWhen, children, }: React.PropsWithChildren<BlocListenerProps<Bloc> & {
    bloc: Bloc;
}>): JSX.Element;
