import { Cubit } from '@jacobtipp/bloc';
import { BlocProvider, useBloc } from '@jacobtipp/react-bloc';

class CounterCubit extends Cubit<number> {
  increment = () => this.emit(this.state + 1);
}

function CounterView() {
  const [count, { increment }] = useBloc(CounterCubit);

  return (
    <div>
      <div>{count}</div>
      <button onClick={increment}>increment</button>
    </div>
  );
}

function CounterList() {
  return (
    <div>
      {[1, 2, 3].map((count) => (
        <CounterFeature key={count} />
      ))}
    </div>
  );
}

function CounterFeature() {
  return (
    <BlocProvider
      blocs={[
        {
          key: CounterCubit,
          create: () => new CounterCubit(0),
        },
      ]}
    >
      <CounterView />
    </BlocProvider>
  );
}

export function App() {
  return <CounterList />;
}

export default App;
