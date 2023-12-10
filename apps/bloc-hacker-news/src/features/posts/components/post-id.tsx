import { useSpring, a } from '@react-spring/web';
import { HomeBloc } from '../../home/bloc/home.cubit';
import { useBlocValue } from '@jacobtipp/react-bloc';

export function PostId() {
  const id = useBlocValue(HomeBloc)
  const props = useSpring({ from: { id }, id, reset: true });

  return <a.h1>{props.id.to(Math.round)}</a.h1>;
}
