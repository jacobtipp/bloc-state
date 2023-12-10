import { useBlocInstance } from '@jacobtipp/react-bloc';
import { HomeBloc } from '../../home/bloc/home.cubit';

export function PostNext() {
  const { setHomeState } = useBlocInstance(HomeBloc);
  return (
    <button onClick={() => setHomeState((state) => state + 1)}>
      <div>→</div>
    </button>
  );
}
