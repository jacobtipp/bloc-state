import { useBlocInstance } from '@jacobtipp/react-bloc';
import { HomeBloc } from '../../home/bloc';

type PostNextProps = {
  id: number;
};

export function PostNext({ id }: PostNextProps) {
  const { setHomeState } = useBlocInstance(HomeBloc);
  return (
    <button
      onClick={() =>
        setHomeState((state) =>
          state.ready((data) => {
            data.id = id + 1;
          })
        )
      }
    >
      <div>→</div>
    </button>
  );
}
