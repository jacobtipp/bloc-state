import { BlocBase, ClassType } from '@jacobtipp/bloc';
import { BlocListenerProps, useBlocListener } from '../../hooks';

export function BlocListener<Bloc extends ClassType<BlocBase<any>>>({
  bloc,
  listener,
  listenWhen,
  children,
}: React.PropsWithChildren<
  BlocListenerProps<InstanceType<Bloc>> & { bloc: Bloc }
>): JSX.Element {
  useBlocListener(bloc, {
    listener,
    listenWhen,
  });
  return <> {children} </>;
}
