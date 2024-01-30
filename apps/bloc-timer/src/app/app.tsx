import {
  BlocProvider,
  useBlocSelector,
  useBloc,
  RootProvider,
} from '@jacobtipp/react-bloc';
import { TimerBloc } from './timer.bloc';
import { Ticker } from './ticker';
import { TimerStatus } from './timer.state';
import { TimerResumed, TimerPaused, TimerReset } from './timer.event';
import { Suspense } from 'react';

const Count = () => {
  const count = useBlocSelector(TimerBloc, {
    selector: (state) => state.data,
    suspendWhen: ({ timerStatus, data }) =>
      timerStatus === TimerStatus.InProgress && data <= 50 && data > 40,
  });

  return <div>{count}</div>;
};

const TimerControls = () => {
  const [status, { add }] = useBloc(TimerBloc, {
    selector: (state) => state.timerStatus,
  });

  if (status === TimerStatus.Initial) {
    return <button onClick={() => add(new TimerResumed())}>{'\u23F5'}</button>;
  }

  if (status === TimerStatus.InProgress) {
    return (
      <>
        <button onClick={() => add(new TimerPaused())}>{'\u23F8'}</button>
        <button onClick={() => add(new TimerReset())}>{'\u21BA'}</button>
      </>
    );
  }
  if (status === TimerStatus.Paused) {
    return (
      <>
        <button onClick={() => add(new TimerResumed())}>{'\u23F5'}</button>
        <button onClick={() => add(new TimerReset())}>{'\u21BA'}</button>
      </>
    );
  }

  if (status === TimerStatus.Completed) {
    return <button onClick={() => add(new TimerReset())}>{'\u21BA'}</button>;
  }

  return;
};

const Timer = ({ id }: { id: number }) => {
  return (
    <BlocProvider
      bloc={TimerBloc}
      create={() => new TimerBloc(id, new Ticker())}
    >
      <Suspense fallback={<h2>Loading...</h2>}>
        <Count />
        <TimerControls />
      </Suspense>
    </BlocProvider>
  );
};

const ids = [1, 2, 3, 4, 5];

function App() {
  return (
    <RootProvider>
      <Suspense fallback={<h1>ParentLoading...</h1>}>
        <p>
          Timers suspend when duration is less than 30 seconds and unsuspend
          when duration reaches 0
        </p>
        <p>Refresh the page to see they persist between refresh</p>
        <>
          {ids.map((id) => (
            <Timer id={id} />
          ))}
        </>
      </Suspense>
    </RootProvider>
  );
}

export default App;
