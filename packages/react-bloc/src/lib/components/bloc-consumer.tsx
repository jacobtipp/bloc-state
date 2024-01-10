import { BlocBase, ClassType, StateType } from '@jacobtipp/bloc';
import { BlocListenerProps, useBlocListener } from '../hooks';
import { BlocBuilder, BlocBuilderProps } from './bloc-builder';

export type BlocConsumerProps<
  Bloc extends ClassType<BlocBase<any>>,
  State = StateType<InstanceType<Bloc>>
> = {
  bloc: Bloc;
} & BlocBuilderProps<Bloc, State> &
  BlocListenerProps<Bloc, State>;

export function BlocConsumer<Bloc extends ClassType<BlocBase<any>>>({
  bloc,
  builder,
  buildWhen,
  listenWhen,
  listener,
}: BlocConsumerProps<Bloc>): JSX.Element {
  useBlocListener(bloc, {
    listener,
    listenWhen,
  });

  return BlocBuilder({
    bloc,
    builder,
    buildWhen,
  });
}
