import { useBlocInstance } from '@jacobtipp/react-bloc';
import { HomeBloc } from '../../home/bloc/home.cubit';

export function PostNext() {
  const { incrementId } = useBlocInstance(HomeBloc);
  return (
    <button onClick={incrementId}>
      <div>→</div>
    </button>
  );
}
